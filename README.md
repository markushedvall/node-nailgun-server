# node-nailgun-server

A Node.js module and CLI for running [Nailgun](http://martiansoftware.com/nailgun/) servers.

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)

This let's you either run Nailgun as a standlone server trough a command line interface or directly through your Node.js applications.

Note that this only provides support for running Nailgun servers. If you are need of a Nailgun client for Node.js, [jvmpin](https://www.npmjs.com/package/jvmpin) is recommended.

# Install

```
npm install node-nailgun-server
```

# Example

By the default the server will listen to all interfaces on port 2113.
```javascript
var nailgun = require('node-nailgun-server');

var server = nailgun.createServer();
server.out.pipe(process.stdout);
```

In the following example [jvmpin](https://www.npmjs.com/package/jvmpin) is used to communicate with the server:
```javascript
var nailgun = require('node-nailgun-server');
var jvmpin = require('jvmpin');

var options {
  address: 'localhost',
  port: 0, // 0 lets the server choose a random port
}

nailgun.createServer(options, function(port) {
  var nail = jvmpin.createConnection(port, 'localhost').spawn('ng-stats');
  nail.stdout.pipe(process.stdout);
});
```

The server object returned when creating a server provides a output stream and also a function for shutting the server down:
```javascript
server.shutdown();
```

Servers are also shutdown automatically when the Node.js process exits.

# CLI

```
Usage: node-nailgun-server [options]

Options:

  -h, --help               output usage information
  -V, --version            output the version number
  -a, --address [address]  the address at which to listen
  -p, --port [port]        the port on which to listen
```

# License
Apache v2