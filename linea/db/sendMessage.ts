import { pool } from "../../db";
import { QueryResult } from "pg"



export interface SendMessageBaseInfo {
    messageHash: string;
    layerType: 1 | 2,
    blockNumber: number;
    txHash: string;
    eventName: string;
    eventSignature: string
}

export interface FeeInfo {
    fee: string;
    gasUsed: string;
    timestamp: number
}

export interface SendMessage extends SendMessageBaseInfo, FeeInfo {

}

// insert event log info
export function insertSendMessageTx(sendMessageInfo: SendMessage): Promise<QueryResult<any>> {
    const { messageHash, layerType, blockNumber, txHash, eventName, eventSignature, fee, gasUsed, timestamp } = sendMessageInfo

    return pool.query(`
        INSERT INTO linea_l1_l2_send_message 
            (message_hash,layer_type,block_number,tx_hash,event_name, event_signature,fee,gas_used,timestamp) VALUES 
            ($1, $2, $3, $4, $5,$6)
    `, [messageHash, layerType, blockNumber, txHash, eventName, eventSignature, fee, gasUsed, timestamp])
}


export function updataSendMessageByTxHash(feeInfo: FeeInfo) {
    const { fee, gasUsed, timestamp } = feeInfo
    return pool.query(`
        UPDATE linea_l1_l2_send_message SET fee=$1 gas_used=$2 timestamp=$3
    `, [fee, gasUsed, timestamp])
}