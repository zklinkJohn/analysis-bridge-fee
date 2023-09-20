import { pool } from '../../db'

export interface MessageInfo {
  layet_type: 1 | 2
  tx_hash: string
  tx_from: string
  tx_to: string
  event_name: string
  gas_used: string
  gas_price: string
  receiver: string
  tx_token: string
  amount: string
}

export async function insertClaimMessage(message: MessageInfo) {
  const {
    layet_type,
    tx_hash,
    tx_from,
    tx_to,
    event_name,
    gas_used,
    gas_price,
    receiver,
    tx_token,
    amount
  } = message
  return pool.query(
    `
        INSERT INTO zksync_claim_message (
            layer_type,
            tx_hash,
            tx_from,
            tx_to,
            event_name,
            gas_used,
            gas_price,
            receiver,
            tx_token,
            amount 
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
    `,
    [
      layet_type,
      tx_hash,
      tx_from,
      tx_to,
      event_name,
      gas_used,
      gas_price,
      receiver,
      tx_token,
      amount
    ]
  )
}
