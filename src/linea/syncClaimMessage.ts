import { EventLog, ethers, JsonRpcProvider, Contract } from 'ethers'
import { L1RPC, ContractAddress, L2RPC } from './constant'
import { sleep } from '../utils/helper'
import L1_ABI from './abis/l1.abi.json'
import L2_ABI from './abis/l2.abi.json'
import {
  LINEA_L1_FROM_BLOCK,
  LINEA_L1_TO_BLOCK,
  LINEA_L2_FROM_BLOCK,
  LINEA_L2_TO_BLOCK
} from '../conf'

import {
  ClaimedMessageBaseInfo,
  insertClaimedMessageTx,
  queryEmptyGasUsedTx,
  updateTxGasUsed
} from './db/claimMessage'
import { ChainLayer } from './types'
import logger from '../logger'

const config: {
  [chainLayer: number]: {
    layerType: 1 | 2
    fromBlock: number
    toBlock: number
  }
} = {
  [ChainLayer.Layer1]: {
    layerType: 1,
    fromBlock: Number(LINEA_L1_FROM_BLOCK),
    toBlock: Number(LINEA_L1_TO_BLOCK)
  },
  [ChainLayer.Layer2]: {
    layerType: 2,
    fromBlock: Number(LINEA_L2_FROM_BLOCK),
    toBlock: Number(LINEA_L2_TO_BLOCK)
  }
}

let provider: JsonRpcProvider
let contract: Contract
export async function syncClaimMessageEvents(chainLayer: ChainLayer) {
  if (chainLayer === ChainLayer.Layer1) {
    provider = new ethers.JsonRpcProvider(L1RPC)
    contract = new Contract(ContractAddress.L1MessageService, L1_ABI, provider)
  } else {
    provider = new ethers.JsonRpcProvider(L2RPC)
    contract = new Contract(ContractAddress.L2MessageService, L2_ABI, provider)
  }
  const filter = contract.filters.MessageClaimed
  const sendMessageEvents = await contract.queryFilter(
    filter,
    config[chainLayer].fromBlock, // start block number
    config[chainLayer].toBlock // end block number
  )
  for (const sendMessageEvent of sendMessageEvents) {
    const eventLog = sendMessageEvent as EventLog
    const baseInfo: ClaimedMessageBaseInfo = {
      messageHash: eventLog.args['_messageHash'],
      layerType: config[chainLayer].layerType,
      blockNumber: eventLog.blockNumber,
      txHash: eventLog.transactionHash,
      eventName: eventLog.eventName
    }
    await insertClaimedMessageTx(baseInfo)
  }
  logger.info(`insert events successful`)
  await updateGasUsedOfTxs()
}

let lastTxIndex = 0
async function updateGasUsedOfTxs() {
  console.log(`updateGasUsedOfTxs: lastTxIndex : ${lastTxIndex}`)
  const transactions = await queryEmptyGasUsedTx()
  for (let index = lastTxIndex; index < transactions.length; index++) {
    const tx = transactions[index]
    logger.info(`transaction index: ${index} txhash: ${tx.txHash}`)
    try {
      const txReceipt = await provider.getTransactionReceipt(tx.txHash)
      if (!txReceipt) {
        logger.error(`tx receipt not found: ${tx.txHash}`)
        continue
      }
      await updateTxGasUsed(
        tx.txHash,
        txReceipt.gasUsed.toString(),
        txReceipt.gasPrice.toString()
      )
      lastTxIndex = index
    } catch (error) {
      logger.error(`getTransactionReceipt failed: `, lastTxIndex, error)
      updateGasUsedOfTxs()
    } finally {
      await sleep(100)
    }
  }
  logger.info(`update gas used successful`)
}
