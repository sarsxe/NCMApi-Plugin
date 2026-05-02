import {
  getNcmApiServiceStatus,
  reloadNcmApiService,
  startNcmApiService
} from '../lib/service.js'

function formatDuration(ms) {
  if (!ms || ms < 1000) return '0秒'

  const totalSeconds = Math.floor(ms / 1000)
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  const parts = []

  if (days) parts.push(days + '天')
  if (hours) parts.push(hours + '小时')
  if (minutes) parts.push(minutes + '分钟')
  if (seconds || !parts.length) parts.push(seconds + '秒')

  return parts.join('')
}

function formatTime(timestamp) {
  if (!timestamp) return '未记录'
  return new Date(timestamp).toLocaleString('zh-CN', { hour12: false })
}

function trimText(text, max = 500) {
  const value = String(text || '')
  return value.length > max ? value.slice(0, max) + '...' : value
}

function getStatusLines(status) {
  const stateText = status.starting ? '启动中' : status.started ? '运行中' : '未运行'
  const modeText = status.started ? (status.external ? '外部复用' : '内置服务') : '未启动'
  const lines = [
    'NCMApi 运行状态',
    '状态：' + stateText,
    '模式：' + modeText,
    '地址：http://' + status.config.host + ':' + status.config.port,
    '端口可达：' + (status.reachable ? '是' : '否'),
    '启动时间：' + (status.startTime ? formatTime(status.startTime) : '未记录'),
    '运行时长：' + (status.startTime ? formatDuration(status.uptimeMs) : '未开始')
  ]

  if (!status.started && status.reachable) {
    lines.push('提示：目标端口可达，但当前插件尚未接管该服务')
  }

  if (status.error) {
    lines.push('最近错误：' + trimText(status.error, 300))
  }

  return lines
}

function buildStatusMessage(status) {
  return getStatusLines(status).join('\n')
}

function buildActionMessage(title, status) {
  return [title, ...getStatusLines(status).slice(1)].join('\n')
}

export class runtime extends plugin {
  constructor() {
    super({
      name: 'NCMApi运行管理',
      dsc: 'NCMApi 运行状态查看与重载控制',
      event: 'message',
      priority: 4000,
      rule: [
        { reg: '^#*(NCM|ncm)(运行)?状态$', fnc: 'status' },
        { reg: '^#*(NCM|ncm)(启动|运行)$', fnc: 'start' },
        { reg: '^#*(NCM|ncm)(重载|重启)$', fnc: 'reload' }
      ]
    })
  }

  async status() {
    const status = await getNcmApiServiceStatus()
    await this.reply(buildStatusMessage(status))
    return true
  }

  async start() {
    if (!this.e.isMaster) {
      await this.reply('您无权操作')
      return true
    }

    const before = await getNcmApiServiceStatus()
    if (before.starting) {
      await this.reply('NCMApi 正在启动中，请稍后再查看状态')
      return true
    }

    try {
      await startNcmApiService()
      const after = await getNcmApiServiceStatus()
      const title = before.started ? 'NCMApi 已在运行' : 'NCMApi 启动完成'
      await this.reply(buildActionMessage(title, after))
    } catch (err) {
      await this.reply('NCMApi 启动失败\n' + trimText(err?.message || err, 500))
    }

    return true
  }

  async reload() {
    if (!this.e.isMaster) {
      await this.reply('您无权操作')
      return true
    }

    const before = await getNcmApiServiceStatus()
    if (before.external) {
      await this.reply([
        'NCMApi 当前为外部复用服务，插件无法安全重载外部进程',
        '地址：http://' + before.config.host + ':' + before.config.port,
        '如需重载，请手动重启外部服务后再执行 #NCM状态 查看结果'
      ].join('\n'))
      return true
    }

    try {
      const result = await reloadNcmApiService()
      const after = await getNcmApiServiceStatus()
      const title = result.reason === 'started' ? 'NCMApi 未运行，已直接启动' : 'NCMApi 已重载'
      await this.reply(buildActionMessage(title, after))
    } catch (err) {
      await this.reply('NCMApi 重载失败\n' + trimText(err?.message || err, 500))
    }

    return true
  }
}
