'use strict'

const { EventEmitter } = require('events')
const { spawn } = require('child_process')
const path = require('path')

const NAILGUN_JAR = path.join(__dirname, '../vendor/nailgun.jar')
const JAVA = 'java'
const DEFAULT_ARGS = ['-Djava.awt.headless=true', '-jar', NAILGUN_JAR]
const DEFAULT_PORT = 2113
const START_TIMEOUT_MS = 2000

class Server extends EventEmitter {
  constructor (options) {
    super()

    const args = getArgsFromOptions(options)
    this._childProcess = spawn(JAVA, args)
    this._childProcess.stderr.pipe(process.stderr)

    this.shutdown = this.close
    this.out = this._childProcess.stdout
    this.started = false
    this.closed = false

    const startListener = data => {
      const started = data.toString().match(/^NGServer .+ started on .+, port (\d+)./)
      if (started) {
        this._childProcess.stdout.removeListener('data', startListener)
        const port = parseInt(started[1], 10)
        this.started = true
        this.emit('start', port)
      }
    }
    this._childProcess.stdout.on('data', startListener)

    this._childProcess.on('error', (err) => {
      this.emit('error', new Error(err))
    })

    this._childProcess.on('exit', (code, signal) => {
      if (!this.closed) {
        this.emit('error', new Error('Nailgun process exited unexpectedly with code: ' + code))
      }
    })

    this._startTimeout = setTimeout(() => {
      if (!this.started) {
        this.emit('error', new Error('Failed to start within: ' + START_TIMEOUT_MS + 'ms'))
      }
    }, START_TIMEOUT_MS)

    process.on('exit', this.close)
  }

  close () {
    if (!this.closed) {
      process.removeListener('exit', this.close)
      this.closed = true
      clearTimeout(this._startTimeout)
      this._childProcess.kill()
      this.emit('close')
    }
  }
}

module.exports.createServer = function (options, callback) {
  if (typeof options === 'function') {
    callback = options
    options = undefined
  }

  const server = new Server(options)

  if (typeof callback === 'function') {
    server.once('start', callback)
  }

  return server
}

function getArgsFromOptions (options) {
  if (options) {
    if (options.port && isNaN(options.port)) {
      throw new TypeError('port must be a number')
    }

    if (options.address && typeof options.address !== 'string') {
      throw new TypeError('address must be a string')
    }

    if (options.address && options.port !== undefined) {
      return DEFAULT_ARGS.concat(options.address + ':' + options.port)
    } else if (options.port !== undefined) {
      return DEFAULT_ARGS.concat(options.port)
    } else if (options.address) {
      return DEFAULT_ARGS.concat(options.address + ':' + DEFAULT_PORT)
    }
  }
  return DEFAULT_ARGS
}
