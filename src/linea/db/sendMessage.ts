import { pool } from '../../db'
import { QueryResult } from 'pg'

export interface SendMessageBaseInfo {
  messageHash: string
  layerType: 1 | 2
  blockNumber: number
  txHash: string
  eventName: string
  fee: string
  from: string
  to: string
}

export interface FeeInfo {
  gasUsed?: string
  gasPrice?: string
  timestamp?: number
}

export interface SendMessage extends SendMessageBaseInfo, FeeInfo {}

// insert event log info
export function insertSendMessageTx(
  sendMessageInfo: SendMessageBaseInfo
): Promise<QueryResult<any>> {
  const { messageHash, layerType, blockNumber, txHash, eventName, fee } =
    sendMessageInfo

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
    [messageHash, layerType, blockNumber, txHash, eventName, fee, 0]
  )
}

export async function queryEmptyGasUsedTx(): Promise<SendMessage[]> {
  const result = await pool.query(`
    SELECT * FROM linea_l1_l2_send_message 
    WHERE gas_used IS NULL 
  `)
  return result.rows.map((v) => buildSendMessage(v))
}

export async function queryZeroFeeTxs(layerType: 1 | 2) {
  const result = await pool.query(`
    SELECT * FROM linea_l1_l2_send_message 
    WHERE fee = '0' AND layer_type = ${layerType}
  `)
  return result.rows.map((v) => buildSendMessage(v))
}

export async function updateTxFromAndTo(
  txHash: string,
  from: string,
  to: string
) {
  return pool.query(
    `
    UPDATE linea_l1_l2_send_message 
    SET tx_from = $1 ,tx_to = $2
    WHERE tx_hash=$3
  `,
    [from, to, txHash]
  )
}

export async function updateTxGasUsed(
  txHash: string,
  gasUsed: string,
  gasPrice: string
) {
  return pool.query(
    `
    UPDATE linea_l1_l2_send_message 
    SET gas_used = $1 ,gas_price = $2
    WHERE tx_hash=$3
  `,
    [gasUsed, gasPrice, txHash]
  )
}

function buildSendMessage(row: {
  message_hash: string
  layer_type: 1 | 2
  block_number: number
  tx_hash: string
  event_name: string
  fee: string
  gas_used: string | null
  gas_price: string | null
  timestamp: number
  tx_from: string
  tx_to: string
}): SendMessage {
  return {
    messageHash: row.message_hash,
    layerType: row.layer_type,
    blockNumber: row.block_number,
    txHash: row.tx_hash,
    eventName: row.event_name,
    fee: row.fee,
    gasUsed: row.gas_used || '',
    gasPrice: row.gas_price || '',
    timestamp: row.timestamp,
    from: row.tx_from,
    to: row.tx_to
  }
}
