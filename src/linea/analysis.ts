import { queryAutoBridge, queryManulyBridge, GasUsed } from './db/analysis'
import BN from 'bignumber.js'
import logger from '../logger'

export async function analysisETHAutoBridge() {
    const bridgeFees = await queryAutoBridge()
    let totalFee = new BN(0)

    for (const bridgeFee of bridgeFees) {
        // Assume the gas fee is 25GWEI
        const gasPrice = new BN(25 * 1e9)
        let singleTxGas = new BN(bridgeFee.sendGasUsed)
            .multipliedBy(bridgeFee.sendGasPrice || gasPrice)
            .plus(BN(bridgeFee.fee))
        totalFee = new BN(totalFee).plus(singleTxGas)
    }

    logger.info(`auto bridge analysis tx count: ${bridgeFees.length}`)
    logger.info(`totalFee: ${totalFee.div(1e18).toString()}`)
    logger.info(
        `averageFee: ${totalFee.div(bridgeFees.length).div(1e18).toString(10)}`
    )
}

async function analysisETHManulyBridge() {
    const bridgeFees = await queryManulyBridge()
    let totalFee = new BN(0)
    for (const bridgeFee of bridgeFees) {
        // Assume the gas fee is 25GWEI
        const gasPrice = new BN(25 * 1e9)
        let singleTxGas = new BN(bridgeFee.sendGasUsed)
            .multipliedBy(bridgeFee.sendGasPrice || gasPrice)
            .plus(BN(bridgeFee.claimGasUsed).multipliedBy(bridgeFee.claimGasPrice || gasPrice))
        totalFee = totalFee.plus(singleTxGas)
    }
    logger.info(`manuly bridge analysis tx count: ${bridgeFees.length}`)
    logger.info(`totalFee: ${totalFee.div(1e18).toString()}`)
    logger.info(
        `averageFee: ${totalFee.div(bridgeFees.length).div(1e18).toString(10)}`
    )
}

async function startAnalysis() {
    await analysisETHAutoBridge()
    console.log("======================")
    await analysisETHManulyBridge()
}

startAnalysis().then(() => {
    process.exit()
}).catch(error => {
    console.log(`analysis failed: `, error)
})