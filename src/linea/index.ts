import { EventLog, ethers, TransactionReceipt } from 'ethers'
import { L1RPC, ContractAddress } from './constant'
import { sleep } from '../utils/helper'
import L1_ABI from './abis/l1.abi.json'
import { LINEA_BLOCKS_COUNT } from "../conf"

import {
    SendMessageBaseInfo,
    insertSendMessageTx,
    queryEmptyGasUsedTx,
    updateTxGasUsed
} from './db/sendMessage'
import logger from '../logger'

const provider = new ethers.JsonRpcProvider(L1RPC)
const contract = new ethers.Contract(
    ContractAddress.L1MessageService,
    L1_ABI,
    provider
)
async function getL1SendMessageEvents() {
    const filter = contract.filters.MessageSent
    const sendMessageEvents = await contract.queryFilter(
        filter,
        Number(LINEA_BLOCKS_COUNT)
        // 18111000,  // start block number
        // 18111003   // end block number
    )
    for (const sendMessageEvent of sendMessageEvents) {
        const eventLog = sendMessageEvent as EventLog
        const baseInfo: SendMessageBaseInfo = {
            messageHash: eventLog.args['_messageHash'],
            fee: eventLog.args['_fee'],
            layerType: 1,
            blockNumber: eventLog.blockNumber,
            txHash: eventLog.transactionHash,
            eventName: eventLog.eventName,
        }
        await insertSendMessageTx(baseInfo)
    }
    logger.info(`insert events successful`)
    updateGasUsedOfTxs()
}

let lastTxIndex = 0
async function updateGasUsedOfTxs() {
    console.log(`updateGasUsedOfTxs: lastTxIndex : ${lastTxIndex}`)
    const transactions = await queryEmptyGasUsedTx()
    for (let index = lastTxIndex; index < transactions.length; index++) {
        const tx = transactions[index]
        try {
            const txReceipt = await provider.getTransactionReceipt(tx.txHash)
            if (!txReceipt) {
                logger.error(`tx receipt not found: ${tx.txHash}`)
                continue;
            }
            await updateTxGasUsed(tx.txHash, txReceipt.gasUsed.toString())
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

// updateGasUsedOfTxs()
getL1SendMessageEvents()
