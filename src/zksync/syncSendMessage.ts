import { ethers, Contract } from "ethers"
import { getConfig, LayerType } from "./constant"

async function syncL1SendMessage() {
    const config = getConfig(LayerType.Layer1)
    const provider = new ethers.providers.JsonRpcProvider(config.rpc)
    const contract = new Contract(config.contractAddress, config.abi, provider)
}