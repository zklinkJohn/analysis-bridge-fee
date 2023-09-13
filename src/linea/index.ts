import { ChainLayer } from './types'
import { syncSendMessageEvents } from './syncSendMessage'
import { syncClaimMessageEvents } from './syncClaimMessage'

async function startSyncMessageEvents() {
  // await syncSendMessageEvents(ChainLayer.Layer1)
  // await syncSendMessageEvents(ChainLayer.Layer2)
  await syncClaimMessageEvents(ChainLayer.Layer1)
  await syncClaimMessageEvents(ChainLayer.Layer2)
  console.log('sync block data success')
  process.exit()
}

startSyncMessageEvents()
