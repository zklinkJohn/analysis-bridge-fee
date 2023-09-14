import { queryZeroFeeTxs, updateTxFromAndTo } from './db/sendMessage'
import { L1RPC, L2RPC } from './constant'
import { ethers } from 'ethers'
import { sleep } from '../utils/helper'
import logger from '../logger'
async function updateSendMessageTable() {
  const txs = await queryZeroFeeTxs(2)
  const provider = new ethers.JsonRpcProvider(L2RPC)
  for (const tx of txs) {
    try {
      console.log(`update tx: ${tx.txHash}`)
      const txReceipt = await provider.getTransactionReceipt(tx.txHash)
      if (!txReceipt) {
        throw new Error('failed')
      }
      await updateTxFromAndTo(tx.txHash, txReceipt?.from, txReceipt.to!)
    } catch (error) {
      logger.error(`fetch tx receipt failed: ${tx.txHash}`)
    }
    await sleep(200)
  }
  console.log('update database successful')
}

updateSendMessageTable()
