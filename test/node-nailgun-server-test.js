/* global describe it */
/* eslint-disable no-unused-expressions */
const chai = require('chai')
const nailgun = require('../lib/node-nailgun-server')

const expect = chai.expect

describe('node-nailgun-server', function () {
  it('should give port in callback', function (done) {
    const server = nailgun.createServer({ port: 4242 }, function (port) {
      expect(port).to.be.equal(4242)
      done()
      server.shutdown()
    })
  })

  it('should give default port 2113', function (done) {
    const server = nailgun.createServer(function (port) {
      expect(port).to.be.equal(2113)
      done()
      server.shutdown()
    })
  })

  it('should give random port when configuring port as 0', function (done) {
    const server = nailgun.createServer({ port: 0 }, function (port) {
      expect(port).to.be.above(0)
      done()
      server.shutdown()
    })
  })

  it('should print a start message when started', function (done) {
    const server = nailgun.createServer()
    server.out.on('data', function (data) {
      const started = data.toString().match(/^NGServer .+ started on .+, port \d+./)
      if (started) {
        expect(started).to.not.be.undefined
        done()
      }
      server.shutdown()
    })
  })

  it('should print a shut down message at shutdown', function (done) {
    const server = nailgun.createServer()
    server.out.on('data', function (data) {
      const started = data.toString().match(/^NGServer .+ started on .+, port \d+./)
      if (started) server.shutdown()
      const shutdown = data.toString().match(/^NGServer shut down./)
      if (shutdown) {
        expect(shutdown).to.not.be.undefined
        done()
      }
    })
  })
})
