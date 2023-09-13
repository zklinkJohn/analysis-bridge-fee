import erc20L1Data from './data/erc20.l1.json'
import erc20L2Data from './data/erc20.l2.json'

import logger from '../logger'

async function analysisERC20() {
  const l1l2TxFees = analysisTxFees(erc20L1Data)
  logger.info(
    `bridge ERC20 L1 to L2 average tx fee: ${l1l2TxFees} ETH tx count: ${erc20L1Data.length}`
  )

  const l2l1TxFees = analysisTxFees(erc20L2Data)
  logger.info(
    `bridge ERC20 L2 to L1 average tx fee: ${l2l1TxFees} ETH  tx count: ${erc20L2Data.length}`
  )
}

function analysisTxFees(txs: any[]): Number {
  let totalFee = 0
  for (const tx of txs) {
    totalFee += Number(tx['TxnFee(ETH)'])
  }
  const averageFee = totalFee / erc20L1Data.length
  return averageFee
}

analysisERC20()
