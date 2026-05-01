import { createRequire } from 'node:module'
import net from 'node:net'

const require = createRequire(import.meta.url)
const PLUGIN_NAME = 'NCMApi-plugin'
const GLOBAL_KEY = Symbol.for('trss-yunzai.ncmapi-plugin.service')
const DEFAULT_HOST = process.env.NCMAPI_HOST || '127.0.0.1'
const DEFAULT_PORT = Number(process.env.NCMAPI_PORT || 3000)

function getState() {
  if (!globalThis[GLOBAL_KEY]) {
    globalThis[GLOBAL_KEY] = {
      started: false,
      starting: null,
      external: false,
      config: null,
      error: null
    }
  }

  return globalThis[GLOBAL_KEY]
}

function getLogger() {
  return globalThis.logger || console
}

function logInfo(message) {
  const logger = getLogger()
  ;(logger.info || logger.log || console.log).call(logger, '[' + PLUGIN_NAME + '] ' + message)
}

function logWarn(message) {
  const logger = getLogger()
  ;(logger.warn || logger.info || logger.log || console.warn).call(logger, '[' + PLUGIN_NAME + '] ' + message)
}

function logError(message, err) {
  const logger = getLogger()
  ;(logger.error || logger.warn || logger.log || console.error).call(logger, '[' + PLUGIN_NAME + '] ' + message)
  if (err) {
    ;(logger.error || logger.warn || logger.log || console.error).call(logger, err)
  }
}

function resolveConfig(options = {}) {
  const host = options.host || DEFAULT_HOST
  const port = Number(options.port || DEFAULT_PORT)
  return { host, port }
}

function isAddressInUse(err) {
  const text = [err?.code, err?.message, err?.cause?.message].filter(Boolean).join(' ')
  return /EADDRINUSE|address already in use/i.test(text)
}

function isPortReachable(host, port, timeout = 1000) {
  return new Promise(resolve => {
    const socket = net.createConnection({ host, port })
    let settled = false

    const finish = value => {
      if (settled) return
      settled = true
      socket.destroy()
      resolve(value)
    }

    socket.setTimeout(timeout)
    socket.once('connect', () => finish(true))
    socket.once('timeout', () => finish(false))
    socket.once('error', () => finish(false))
  })
}

export function getNcmApiServiceState() {
  const state = getState()
  return {
    started: state.started,
    starting: Boolean(state.starting),
    external: state.external,
    config: state.config,
    error: state.error ? String(state.error?.message || state.error) : null
  }
}

export async function startNcmApiService(options = {}) {
  const state = getState()

  if (state.started) return state.config
  if (state.starting) return state.starting

  state.starting = (async () => {
    const config = resolveConfig(options)

    try {
      const { serveNcmApi } = require('NeteaseCloudMusicApi')
      await serveNcmApi(config)

      state.started = true
      state.external = false
      state.config = config
      state.error = null

      logInfo('本地 NeteaseCloudMusicApi 已启动：http://' + config.host + ':' + config.port)
      return config
    } catch (err) {
      if (isAddressInUse(err) && await isPortReachable(config.host, config.port)) {
        state.started = true
        state.external = true
        state.config = config
        state.error = null

        logWarn('检测到 ' + config.host + ':' + config.port + ' 已有服务占用，跳过内置启动并复用现有服务')
        return config
      }

      state.error = err
      logError('本地 NeteaseCloudMusicApi 启动失败', err)
      throw err
    } finally {
      state.starting = null
    }
  })()

  return state.starting
}
