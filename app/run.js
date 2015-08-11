'use strict';

var startServer = require('./server');

module.exports = startServer;

if (module === require.main) {
    startServer();
}
