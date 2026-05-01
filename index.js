import fs from 'node:fs'
import { startNcmApiService } from './lib/service.js'

const pluginDir = 'NCMApi-plugin'
const appDir = './plugins/' + pluginDir + '/apps'

startNcmApiService({ from: 'plugin' }).catch(err => {
  const message = String((err && err.message) || err)
  if (/Cannot find module|Cannot find package|ERR_MODULE_NOT_FOUND/.test(message)) {
    logger.warn('[' + pluginDir + '] 缺少依赖 NeteaseCloudMusicApi，请进入 ./plugins/' + pluginDir + ' 执行 npm install')
    return
  }

  logger.error('[' + pluginDir + '] 自动启动本地 NeteaseCloudMusicApi 失败')
  logger.error(err)
})

const files = fs.existsSync(appDir)
  ? fs.readdirSync(appDir).filter(file => file.endsWith('.js')).sort()
  : []

let ret = files.map(file => import('./apps/' + file))
ret = await Promise.allSettled(ret)

let apps = {}
for (let i in files) {
  const name = files[i].replace('.js', '')

  if (ret[i].status !== 'fulfilled') {
    handleError(name, ret[i].reason)
    continue
  }

  apps[name] = ret[i].value[Object.keys(ret[i].value)[0]]
}

logger.info('[' + pluginDir + '] 初始化完成，已加载 ' + Object.keys(apps).length + ' 个功能模块')

export { apps }

function handleError(name, err) {
  const message = String((err && err.message) || err)

  if (/Cannot find module|Cannot find package|ERR_MODULE_NOT_FOUND/.test(message)) {
    logger.warn('[' + pluginDir + '] ' + logger.yellow(name) + ' 缺少依赖，请进入 ./plugins/' + pluginDir + ' 执行 npm install')
    logger.warn('[' + pluginDir + '] 详细错误：' + message)
    return
  }

  logger.error('[' + pluginDir + '] 载入插件错误：' + logger.red(name))
  logger.error(err)
}
