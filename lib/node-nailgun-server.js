'use strict'

const childProcess = require('child_process')
const path = require('path')

const NAILGUN_JAR = path.join(__dirname, '../vendor/nailgun.jar')
const JAVA = 'java'
const DEFAULT_ARGS = ['-Djava.awt.headless=true', '-jar', NAILGUN_JAR]
const DEFAULT_PORT = 2113

module.exports.createServer = function (options, callback) {
  if (typeof options === 'function') {
    callback = options
    options = undefined
  }

  const args = getArgsFromOptions(options)

  const server = childProcess.spawn(JAVA, args)

  server.stdout.on('data', (data) => {
    const started = data.toString().match(/^NGServer .+ started on .+, port \d+./)
    if (started) {
      const portStr = started[0].match(/(port )+(\d+)\./)[2]
      const port = parseInt(portStr, 10)

      if (typeof callback === 'function') {
        callback(port)
      }
    }
  })

  function shutdown () {
    server.kill()
  }

  process.on('exit', shutdown)

  return {
    out: server.stdout,
    shutdown: shutdown
  }
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
