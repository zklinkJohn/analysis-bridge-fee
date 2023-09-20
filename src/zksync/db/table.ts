import { pool } from '../../db'
import logger from '../../logger'

const createSendMessageTable = `
    CREATE TABLE IF NOT EXISTS zksync_send_message (
        id SERIAL PRIMARY KEY,
        layer_type INTEGER,
        tx_hash VARCHAR,
        tx_from VARCHAR,
        tx_to VARCHAR,
        event_name VARCHAR,
        gas_used VARCHAR,
        gas_price VARCHAR,
        receiver VARCHAR,
        token_addr VARCHAR,
        amount VARCHAR
    )
`

const createClaimMessageTable = `
    CREATE TABLE IF NOT EXISTS zksync_claim_message (
        id SERIAL PRIMARY KEY,
        layer_type INTEGER,
        tx_hash VARCHAR,
        tx_from VARCHAR,
        tx_to VARCHAR,
        event_name VARCHAR,
        gas_used VARCHAR,
        gas_price VARCHAR,
        receiver VARCHAR,
        token_addr VARCHAR,
        amount VARCHAR
    )
`

async function initializeDatabase() {
  try {
    const client = await pool.connect()
    await client.query(createSendMessageTable)
    await client.query(createClaimMessageTable)
    logger.info('initialize database success')
  } catch (error) {
    logger.error(`initialize database failed`, error)
  }

  process.exit()
}

initializeDatabase()
