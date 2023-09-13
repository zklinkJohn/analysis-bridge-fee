import { Client } from 'jayson/promise'

const zksyncClient = Client.https({
  host: 'https://mainnet.era.zksync.io'
})

// zksync sdk not support ethers@6. so call RPC manuly

export interface TransactionDetails {
  ethExecuteTxHash: string
  ethProveTxHash: string
  fee: string
  gasPerPubdata: string
  status: string
}
export function getTransactionDetails(
  txHash: string
): Promise<TransactionDetails> {
  return zksyncClient
    .request('zks_getTransactionDetails', [txHash])
    .then((res) => res.json())
}
