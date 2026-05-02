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
      error: null,
      app: null,
      server: null,
      startTime: null
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
  const state = getState()
  const baseConfig = state.config || {}
  const host = options.host || baseConfig.host || DEFAULT_HOST
  const port = Number(options.port || baseConfig.port || DEFAULT_PORT)
  return { host, port }
}

function normalizeError(err) {
  return err ? String(err?.message || err) : null
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

function attachServer(server) {
  if (!server || typeof server.once !== 'function') return

  server.once('close', () => {
    const state = getState()
    if (state.server !== server) return

    state.started = false
    state.external = false
    state.app = null
    state.server = null
    state.startTime = null
  })
}

function clearRuntimeState({ preserveConfig = true } = {}) {
  const state = getState()
  const config = preserveConfig ? (state.config || resolveConfig()) : null

  state.started = false
  state.external = false
  state.app = null
  state.server = null
  state.startTime = null
  state.error = null
  state.config = config
}

export function getNcmApiServiceState() {
  const state = getState()
  return {
    started: state.started,
    starting: Boolean(state.starting),
    external: state.external,
    config: state.config,
    startTime: state.startTime,
    uptimeMs: state.startTime ? Math.max(0, Date.now() - state.startTime) : 0,
    error: normalizeError(state.error)
  }
}

export async function getNcmApiServiceStatus(options = {}) {
  const state = getState()
  const config = resolveConfig(options)
  const reachable = await isPortReachable(config.host, config.port)

  if (state.started && !state.external && (!state.server || !state.server.listening) && !state.starting) {
    clearRuntimeState()
  }

  if (state.started && state.external && !reachable && !state.starting) {
    clearRuntimeState()
  }

  return {
    started: state.started,
    starting: Boolean(state.starting),
    external: state.external,
    managed: state.started && !state.external,
    config,
    reachable,
    startTime: state.startTime,
    uptimeMs: state.startTime ? Math.max(0, Date.now() - state.startTime) : 0,
    error: normalizeError(state.error)
  }
}

export async function startNcmApiService(options = {}) {
  const state = getState()
  const config = resolveConfig(options)

  if (state.started) {
    if (state.external) {
      if (await isPortReachable(config.host, config.port)) return state.config || config
      clearRuntimeState()
    } else if (state.server && state.server.listening) {
      return state.config || config
    } else {
      clearRuntimeState()
    }
  }

  if (state.starting) return state.starting

  state.starting = (async () => {
    try {
      const { serveNcmApi } = require('NeteaseCloudMusicApi')
      const app = await serveNcmApi(config)
      const server = app?.server || null

      state.started = true
      state.external = false
      state.config = config
      state.error = null
      state.app = app || null
      state.server = server
      state.startTime = Date.now()

      attachServer(server)
      logInfo('本地 NeteaseCloudMusicApi 已启动：http://' + config.host + ':' + config.port)
      return config
    } catch (err) {
      if (isAddressInUse(err) && await isPortReachable(config.host, config.port)) {
        state.started = true
        state.external = true
        state.config = config
        state.error = null
        state.app = null
        state.server = null
        state.startTime = Date.now()

        logWarn('检测到 ' + config.host + ':' + config.port + ' 已有服务占用，跳过内置启动并复用现有服务')
        return config
      }

      state.started = false
      state.external = false
      state.app = null
      state.server = null
      state.startTime = null
      state.config = config
      state.error = err

      logError('本地 NeteaseCloudMusicApi 启动失败', err)
      throw err
    } finally {
      state.starting = null
    }
  })()

  return state.starting
}

export async function stopNcmApiService(options = {}) {
  const state = getState()
  const config = resolveConfig(options)

  if (state.starting) {
    try {
      await state.starting
    } catch {}
  }

  if (!state.started) {
    return {
      stopped: false,
      reason: 'not_started',
      external: false,
      config
    }
  }

  if (state.external) {
    return {
      stopped: false,
      reason: 'external',
      external: true,
      config
    }
  }

  const server = state.server || state.app?.server
  if (!server) {
    clearRuntimeState()
    return {
      stopped: true,
      reason: 'no_server_handle',
      external: false,
      config
    }
  }

  await new Promise((resolve, reject) => {
    try {
      server.close(err => err ? reject(err) : resolve())
    } catch (err) {
      reject(err)
    }
  })

  clearRuntimeState()
  logInfo('本地 NeteaseCloudMusicApi 已停止')

  return {
    stopped: true,
    reason: 'stopped',
    external: false,
    config
  }
}

export async function reloadNcmApiService(options = {}) {
  const config = resolveConfig(options)
  const status = await getNcmApiServiceStatus(config)

  if (status.external) {
    return {
      reloaded: false,
      reason: 'external',
      config: status.config
    }
  }

  if (status.started) {
    await stopNcmApiService(config)
    await startNcmApiService(config)
    return {
      reloaded: true,
      reason: 'restarted',
      config
    }
  }

  await startNcmApiService(config)
  return {
    reloaded: true,
    reason: 'started',
    config
  }
}
