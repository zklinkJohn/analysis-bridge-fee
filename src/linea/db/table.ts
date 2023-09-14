import { pool } from '../../db'
import logger from '../../logger'

/**
 * layer_type: 1: L1  2: L2
 */
const createSendMessageTable = `
    CREATE TABLE IF NOT EXISTS linea_l1_l2_send_message (
        message_hash VARCHAR NOT NULL PRIMARY KEY,
        layer_type INTEGER NOT NULL, 
        block_number INTEGER NOT NULL,
        tx_hash VARCHAR(66) NOT NULL,
        event_name VARCHAR,
        fee VARCHAR,
        gas_used VARCHAR,
        gas_price VARCHAR,
        timestamp INTEGER,
        tx_from VARCHAR,
        tx_to VARCHAR
    )
`

/**
 * layer_type:  1: l1 2: l2
 */
const createClaimMessageTable = `
    CREATE TABLE IF NOT EXISTS linea_l1_l2_claim_message (
        message_hash VARCHAR(66) NOT NULL UNIQUE,
        layer_type INTEGER NOT NULL,
        block_number INTEGER NOT NULL,
        tx_hash VARCHAR(66) NOT NULL,
        event_name VARCHAR,
        gas_used VARCHAR,
        gas_price VARCHAR,
        timestamp INTEGER
    )
`

async function initializeDatabase() {
  try {
    const client = await pool.connect()
    await client.query(createSendMessageTable)
    await client.query(createClaimMessageTable)
    logger.info(`initialize database success`)
    client.release()
    process.exit()
  } catch (error) {
    logger.error(`initialize database failed: `, error)
  }
}

initializeDatabase()
