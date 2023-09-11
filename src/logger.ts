import log4js from 'log4js'
import path from 'path'
log4js.configure({
  appenders: {
    file: {
      type: 'file',
      filename: path.resolve(__dirname, 'logs/logs.log'),
      layout: {
        type: 'pattern',
        pattern: '[%d{yyyy-MM-dd hh:mm:ss}] [%p] %m'
      }
    },
    out: {
      type: 'stdout',
      layout: {
        type: 'pattern',
        pattern: '[%d{yyyy-MM-dd hh:mm:ss}] [%p] %m'
      }
    }
  },
  categories: {
    default: {
      appenders: ['file', 'out'],
      level: 'error'
    }
  }
})
const logger = log4js.getLogger('logger')
logger.level = 'info'

export default logger
