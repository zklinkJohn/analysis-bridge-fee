import L1_ABI from "../abi/l1.abi.json"
import L2_ABI from "../abi/l2.abi.json"

export const L1_RPC = 'https://zksync.drpc.org'
export const L2_RPC = "https://mainnet.era.zksync.io"

export const ContractAddress = {
    L1MessageService: '0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063',
    L2MessageService: '0x11f943b2c77b743AB90f4A0Ae7d5A4e7FCA3E102'
}

export enum LayerType {
    Layer1,
    Layer2
}

export interface Config {
    contractAddress: string;
    rpc: string;
    abi: any
}
export function getConfig(layerType: LayerType): Config {
    if (layerType === LayerType.Layer1) {
        return {
            contractAddress: ContractAddress.L1MessageService,
            rpc: L1_RPC,
            abi: L1_ABI
        }
    } else {
        return {
            contractAddress: ContractAddress.L2MessageService,
            rpc: L2_RPC,
            abi: L2_ABI
        }
    }
}