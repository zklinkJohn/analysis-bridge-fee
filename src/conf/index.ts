import dotenv from 'dotenv'
dotenv.config({})

export const DATABASE_CONNECTION = process.env.DATABASE_CONNECTION
export const LINEA_L1_FROM_BLOCK = process.env.LINEA_L1_FROM_BLOCK
export const LINEA_L1_TO_BLOCK = process.env.LINEA_L1_TO_BLOCK
export const LINEA_L2_FROM_BLOCK = process.env.LINEA_L2_FROM_BLOCK
export const LINEA_L2_TO_BLOCK = process.env.LINEA_L2_TO_BLOCK
