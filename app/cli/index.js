'use strict';

var opts = require('./opts').opts,
    getopt = require('./opts').getopt,
    config = require('../../config'),
    startServer = require('../server'),
    url = require('url');

function startCLI() {
    var settings = {};

    try {
        settings = makeSettings(opts);
    } catch(e) {
        console.error(e.message + '\n');
        opts.options.help = true;
    }

    if (opts.options.help) {
        getopt.showHelp();
        process.exit(0);
    }

    startServer(settings);
}

function makeSettings(opts) {
    var settings = {};

    if (opts.argv.length !== 1) {
        throw new Error('No URL provided');
    }

    var parsedURL = url.parse(opts.argv[0]);

    settings.dest_host = parsedURL.hostname;
    settings.dest_hostname = parsedURL.hostname;
    settings.dest_protocol = parsedURL.protocol.substr(0, parsedURL.protocol.length - 1);
    settings.dest_port = parsedURL.port || portFromProtocol(settings.dest_protocol);
    settings.proxy_port = opts.options.port || config.defaultProxyPort;
    settings.accessLog = opts.options['access-log'];

    return settings;
}

function portFromProtocol(proto) {
    switch (proto) {
        case 'http':
            return 80;

        default:
            throw new Error('Invalid/unsupported protocol: ' + proto);
    }
}

module.exports = {
    startCLI: startCLI
};

if (module === require.main) {
    startCLI();
}
