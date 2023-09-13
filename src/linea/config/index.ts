import { ChainLayer } from '../types'
import {
  LINEA_L1_FROM_BLOCK,
  LINEA_L1_TO_BLOCK,
  LINEA_L2_FROM_BLOCK,
  LINEA_L2_TO_BLOCK
} from '../../conf'
export const config: {
  [chainLayer: number]: {
    layerType: 1 | 2
    fromBlock: number
    toBlock: number
  }
} = {
  [ChainLayer.Layer1]: {
    layerType: 1,
    fromBlock: Number(LINEA_L1_FROM_BLOCK),
    toBlock: Number(LINEA_L1_TO_BLOCK)
  },
  [ChainLayer.Layer2]: {
    layerType: 2,
    fromBlock: Number(LINEA_L2_FROM_BLOCK),
    toBlock: Number(LINEA_L2_TO_BLOCK)
  }
}
