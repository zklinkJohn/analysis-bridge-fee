import {
  queryL1ToL2AutoBridge,
  queryL2ToL1AutoBridge,
  queryL1ToL2ManulyBridge,
  queryL2ToL1ManulyBridge,
  GasUsed
} from './db/analysis'
import BN from 'bignumber.js'
import logger from '../logger'

function analysisETHAutoBridge(bridgeFees: GasUsed[]): BN {
  let totalFee = new BN(0)

  for (const bridgeFee of bridgeFees) {
    // Assume the gas fee is 25GWEI
    const gasPrice = new BN(25 * 1e9)
    let singleTxGas = new BN(bridgeFee.sendGasUsed)
      .multipliedBy(bridgeFee.sendGasPrice || gasPrice)
      .plus(BN(bridgeFee.fee))
    totalFee = new BN(totalFee).plus(singleTxGas)
  }
  const averageFee = totalFee.div(bridgeFees.length).div(1e18)
  return averageFee
}

function analysisETHManulyBridge(bridgeFees: GasUsed[]): BN {
  let totalFee = new BN(0)
  for (const bridgeFee of bridgeFees) {
    // Assume the gas fee is 25GWEI
    const gasPrice = new BN(25 * 1e9)
    let singleTxGas = new BN(bridgeFee.sendGasUsed)
      .multipliedBy(bridgeFee.sendGasPrice || gasPrice)
      .plus(
        BN(bridgeFee.claimGasUsed).multipliedBy(
          bridgeFee.claimGasPrice || gasPrice
        )
      )
    totalFee = totalFee.plus(singleTxGas)
  }

  const averageFee = totalFee.div(bridgeFees.length).div(1e18)
  return averageFee
}

async function startAnalysis() {
  const l1ToL2AutoBridgeFees = await queryL1ToL2AutoBridge()
  const l1l2AutoBridgeAverageFee = analysisETHAutoBridge(l1ToL2AutoBridgeFees)
  logger.info(
    `L1 to L2 auto bridge average fee: ${l1l2AutoBridgeAverageFee.toString(10)}`
  )

  const l2Tol1AutoBridgeFees = await queryL2ToL1AutoBridge()
  const l2l1AutoBridgeAverageFee = analysisETHAutoBridge(l2Tol1AutoBridgeFees)
  console.log({ l2l1AutoBridgeAverageFee })
  logger.info(
    `L2 to L1 auto bridge average fee: ${l2l1AutoBridgeAverageFee.toString(10)}`
  )

  const l1ToL2ManulyBridgeFees = await queryL1ToL2ManulyBridge()
  const l1l2ManulyBridgeAverageFee = analysisETHManulyBridge(
    l1ToL2ManulyBridgeFees
  )
  logger.info(
    `L1 to L2 manuly bridge average fee: ${l1l2ManulyBridgeAverageFee.toString(
      10
    )}`
  )

  const l2Tol1ManulyBridgeFees = await queryL2ToL1ManulyBridge()
  const l2l1ManulyBridgeAverageFee = analysisETHManulyBridge(
    l2Tol1ManulyBridgeFees
  )
  logger.info(
    `L2 to L1 manuly bridge average fee: ${l2l1ManulyBridgeAverageFee.toString(
      10
    )}`
  )
}

startAnalysis()
  .then(() => {
    process.exit()
  })
  .catch((error) => {
    console.log(`analysis failed: `, error)
  })
