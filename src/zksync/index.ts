// import { Provider, Contract } from 'zksync-web3'
import L2ERC20_BRIDGE_ABI from './abi/l2.abi.json'
import { ethers, Contract, EventFilter } from 'ethers'

// getTransaction()
const L2ContractAddress = '0x11f943b2c77b743AB90f4A0Ae7d5A4e7FCA3E102'
async function main() {
  const provider = new ethers.providers.JsonRpcProvider(
    'https://mainnet.era.zksync.io'
  )

  const contract = new Contract(L2ContractAddress, L2ERC20_BRIDGE_ABI, provider)
  const filter = contract.filters.FinalizeDeposit as EventFilter
  console.log({ filter })
  const logs = await contract.queryFilter(filter, 13728691, 13732029)
  console.log({ logs })
}

main()
