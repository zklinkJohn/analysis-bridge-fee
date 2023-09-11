import dotenv from 'dotenv'
dotenv.config({})

export const DATABASE_CONNECTION = process.env.DATABASE_CONNECTION
export const LINEA_BLOCKS_COUNT = process.env.LINEA_BLOCKS_COUNT