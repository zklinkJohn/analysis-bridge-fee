import { Pool,PoolConfig } from "pg"
import { DATABASE_CONNECTION } from "../conf"

const config: PoolConfig = {
    connectionString: DATABASE_CONNECTION,
    max: 30,
    connectionTimeoutMillis: 5000,
    idleTimeoutMillis: 30000
}

export const pool = new Pool(config)
export const client =  pool.connect().then(client=> client)