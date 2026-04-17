import fs from 'node:fs'

const pluginDir = 'NCMApi-Plugin'
const appDir = './plugins/' + pluginDir + '/apps'
const files = fs.existsSync(appDir)
  ? fs.readdirSync(appDir).filter(file => file.endsWith('.js'))
  : []

let ret = []
files.forEach(file => {
  ret.push(import('./apps/' + file))
})

ret = await Promise.allSettled(ret)

let apps = {}
for (let i in files) {
  const name = files[i].replace('.js', '')
  if (ret[i].status !== 'fulfilled') {
    logger.error('载入插件错误：' + logger.red(name))
    logger.error(ret[i].reason)
    continue
  }
  apps[name] = ret[i].value[Object.keys(ret[i].value)[0]]
}

logger.info('NCMApi-Plugin 初始化完成，已加载 ' + Object.keys(apps).length + ' 个功能模块')

export { apps }
