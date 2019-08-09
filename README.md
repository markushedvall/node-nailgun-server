# node-nailgun-server

A Node.js module for running [Nailgun](http://martiansoftware.com/nailgun/) servers.

[![npm Version](https://img.shields.io/npm/v/node-nailgun-server.svg)](https://www.npmjs.com/package/node-nailgun-server) [![Build Status](https://travis-ci.org/markushedvall/node-nailgun-server.svg)](https://travis-ci.org/markushedvall/node-nailgun-server) [![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)

This package enable you to run Nailgun servers through your Node.js applications.

Note that this only provides support for running Nailgun servers. If you are need of a Nailgun client for Node.js, [node-nailgun-client](https://www.npmjs.com/package/node-nailgun-client) is recommended.

# Install

```
npm install node-nailgun-server
```

# Example

By the default the server will listen to all interfaces on port 2113.
```javascript
const nailgun = require('node-nailgun-server');

const server = nailgun.createServer();
server.out.pipe(process.stdout);
```

In the following example [node-nailgun-client](https://www.npmjs.com/package/node-nailgun-client) is used to communicate with the server:
```javascript
const nailgun = require('node-nailgun-server');
const client = require('node-nailgun-client');

const options = {
  address: 'localhost',
  port: 0, // 0 lets the server choose a random port
}

nailgun.createServer(options, function(port) {
  const nail = client.exec('ng-stats', { port: port })
  nail.stdout.pipe(process.stdout);
});
```

The server object returned when creating a server provides a output stream and also a function for shutting the server down:
```javascript
server.shutdown();
```

Servers are also shutdown automatically when the Node.js process exits.

# License
Apache License 2.0
