import { pool } from '../../db'
import { QueryResult } from 'pg'

export interface ClaimedMessageBaseInfo {
  messageHash: string
  layerType: 1 | 2
  blockNumber: number
  txHash: string
  eventName: string
}

export interface FeeInfo {
  gasUsed?: string
  gasPrice?: string
  timestamp?: number
}

export interface ClaimedMessage extends ClaimedMessageBaseInfo, FeeInfo {}

// insert event log info
export function insertClaimedMessageTx(message: ClaimedMessageBaseInfo) {
  const { messageHash, layerType, blockNumber, txHash, eventName } = message
  return pool.query(
    `
        INSERT INTO linea_l1_l2_claim_message 
            (
            message_hash,
            layer_type,
            block_number,
            tx_hash,
            event_name, 
            timestamp
            ) 
            VALUES ($1, $2, $3, $4, $5, $6)
    `,
    [messageHash, layerType, blockNumber, txHash, eventName, 0]
  )
}

export async function queryEmptyGasUsedTx(): Promise<ClaimedMessage[]> {
  const result = await pool.query(`
    SELECT * FROM linea_l1_l2_claim_message 
    WHERE gas_used IS NULL 
  `)
  return result.rows.map((v) => buildClaimedMessage(v))
}

export async function updateTxGasUsed(
  txHash: string,
  gasUsed: string,
  gasPrice: string
) {
  return pool.query(
    `
    UPDATE linea_l1_l2_claim_message 
    SET gas_used = $1 , gas_price = $2
    WHERE tx_hash=$3
  `,
    [gasUsed, gasPrice, txHash]
  )
}

function buildClaimedMessage(row: {
  message_hash: string
  layer_type: 1 | 2
  block_number: number
  tx_hash: string
  event_name: string
  gas_used: string | null
  gas_price: string | null
  timestamp: number
}): ClaimedMessage {
  return {
    messageHash: row.message_hash,
    layerType: row.layer_type,
    blockNumber: row.block_number,
    txHash: row.tx_hash,
    eventName: row.event_name,
    gasUsed: row.gas_used || '',
    gasPrice: row.gas_price || '',
    timestamp: row.timestamp
  }
}
