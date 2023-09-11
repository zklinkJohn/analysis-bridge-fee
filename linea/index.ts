import { EventLog, ethers, TransactionReceipt } from "ethers";
import { L1RPC, ContractAddress } from "./constant"
import L1_ABI from "./abis/l1.abi.json"

import { SendMessage, SendMessageBaseInfo, FeeInfo, insertSendMessageTx } from "./db/sendMessage"

async function getL1SendMessageEvents() {
    const provider = new ethers.JsonRpcProvider(L1RPC)
    const contract = new ethers.Contract(ContractAddress.L1MessageService, L1_ABI, provider)
    const filter = contract.filters.MessageSent
    const sendMessageEvents = await contract.queryFilter(filter, 18111000, 18111003);
    for (const sendMessageEvent of sendMessageEvents) {
        const eventLog = sendMessageEvent as EventLog
        const txReceipt = await eventLog.getTransactionReceipt()
        const { gasUsed, gasPrice } = txReceipt
        const baseInfo: SendMessage = {
            messageHash: eventLog.args["_messageHash"],
            fee: eventLog.args["_fee"],
            gasUsed: gasUsed.toString(),
            layerType: 1,
            blockNumber: eventLog.blockNumber,
            txHash: eventLog.transactionHash,
            eventName: eventLog.eventName,
            eventSignature: eventLog.eventSignature,
            timestamp: 0
        }
        await insertSendMessageTx(baseInfo)
        console.log({ eventLog, txReceipt })
    }
}

async function updateL1Fees() {

}

getL1SendMessageEvents()