import { pool } from '../../db'

export interface GasUsed {
  fee: string
  sendLayerType: 1 | 2
  sendTxHash: string
  sendGasUsed: string
  sendGasPrice: string
  claimTxHash: string
  claimGasUsed: string
  claimGasPrice: string
}

export async function queryManulyBridge(): Promise<GasUsed[]> {
  const result = await pool.query(`
        SELECT 
        lllsm.fee, lllsm.gas_used s_gas_used,lllcm.gas_used c_gas_used
        FROM linea_l1_l2_claim_message lllcm 
        INNER JOIN linea_l1_l2_send_message lllsm
        ON lllcm.message_hash=lllsm.message_hash
        WHERE lllsm.fee = '0'
    `)

  return result.rows.map((v) => buildGasFees(v))
}

// auto bridge transaction fees
export async function queryAutoBridge(): Promise<GasUsed[]> {
  const result = await pool.query(`
        SELECT 
        lllsm.fee s_fee,
        lllsm.layer_type s_layer_type,
        lllsm.tx_hash s_tx_hash,
        lllsm.gas_used s_gas_used, 
        lllsm.gas_price s_gas_price,
        lllcm.tx_hash c_tx_hash,
        lllcm.gas_used c_gas_used,
        lllcm.gas_price c_gas_price
        FROM linea_l1_l2_claim_message lllcm
        LEFT JOIN linea_l1_l2_send_message lllsm
        ON lllcm.message_hash = lllsm.message_hash
        WHERE lllsm.fee > '0'
    `)

  return result.rows.map((v) => buildGasFees(v))
}

function buildGasFees(row: {
  s_fee: string
  s_layer_type: 1 | 2
  s_tx_hash: string
  s_gas_used: string
  s_gas_price: string
  c_tx_hash: string
  c_gas_used: string
  c_gas_price: string
}): GasUsed {
  return {
    fee: row.s_fee,
    sendLayerType: row.s_layer_type,
    sendTxHash: row.s_tx_hash,
    sendGasUsed: row.s_gas_used,
    sendGasPrice: row.s_gas_price,
    claimTxHash: row.c_tx_hash,
    claimGasUsed: row.c_gas_used,
    claimGasPrice: row.c_gas_price
  }
}
