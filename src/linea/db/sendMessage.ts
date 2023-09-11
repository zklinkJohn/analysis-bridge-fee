import { pool } from '../../db'
import { QueryResult } from 'pg'

export interface SendMessageBaseInfo {
  messageHash: string
  layerType: 1 | 2
  blockNumber: number
  txHash: string
  eventName: string
  fee: string
}

export interface FeeInfo {
  gasUsed?: string;
  timestamp?: number
}

export interface SendMessage extends SendMessageBaseInfo, FeeInfo { }

// insert event log info
export function insertSendMessageTx(
  sendMessageInfo: SendMessageBaseInfo
): Promise<QueryResult<any>> {
  const {
    messageHash,
    layerType,
    blockNumber,
    txHash,
    eventName,
    fee
  } = sendMessageInfo

  return pool.query(
    `
        INSERT INTO linea_l1_l2_send_message 
            (
              message_hash,
              layer_type,
              block_number,
              tx_hash,
              event_name, 
              fee,
              timestamp
            ) 
            VALUES ($1, $2, $3, $4, $5, $6, $7)
    `,
    [
      messageHash,
      layerType,
      blockNumber,
      txHash,
      eventName,
      fee,
      0
    ]
  )
}

export async function queryEmptyGasUsedTx(): Promise<SendMessage[]> {
  const result = await pool.query(`
    SELECT * FROM linea_l1_l2_send_message WHERE gas_used IS NULL 
  `)
  return result.rows.map(v => buildSendMessage(v))
}

export async function updateTxGasUsed(txHash: string, gasUsed: string) {
  return pool.query(`
    UPDATE linea_l1_l2_send_message SET gas_used = $1 WHERE tx_hash=$2
  `, [gasUsed, txHash])
}


function buildSendMessage(row: {
  message_hash: string;
  layer_type: 1 | 2;
  block_number: number;
  tx_hash: string;
  event_name: string;
  fee: string;
  gas_used: string | null;
  timestamp: number
}): SendMessage {
  return {
    messageHash: row.message_hash,
    layerType: row.layer_type,
    blockNumber: row.block_number,
    txHash: row.tx_hash,
    eventName: row.event_name,
    fee: row.fee,
    gasUsed: row.gas_used || '',
    timestamp: row.timestamp
  }
}
