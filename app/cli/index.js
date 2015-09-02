#!/usr/bin/env node
'use strict';

var opts = require('./opts').opts,
    getopt = require('./opts').getopt,
    config = require('../../config'),
    startServer = require('../server'),
    troll = require('../server/lib/troll'),
    printf = require('../server/lib/console').printf,
    chalk = require('chalk'),
    url = require('url'),
    keypress = require('keypress');

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

    listenToKeyInput();

    startServer(settings);
}

function listenToKeyInput() {
    keypress(process.stdin);

    var buffer = null,
        timeout;

    function executeIfComplete() {
        // 50%
        // 200,400

        var errorRateMatch = /^([0-9]{1,3})%$/.exec(buffer),
            responseTimeMatch = /^([0-9]{1,5}),([0-9]{1,5})$/.exec(buffer);

        if (errorRateMatch) {
            troll.statusCode(parseInt(errorRateMatch[1]) / 100);
        }

        if (responseTimeMatch) {
            troll.responseTime(parseInt(responseTimeMatch[1]), parseInt(responseTimeMatch[2]));
        }

        if (buffer === 'stop') {
            troll.stopTrolling();
        }

        buffer = null;
    }

    function onKeyPress(char) {
        clearTimeout(timeout);
        timeout = setTimeout(executeIfComplete, 1000);

        if (!buffer) {
            buffer = char;
        } else {
            buffer += char;
        }
    }

    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.setEncoding('utf8');
    process.stdin.on('keypress', function (data, key) {
        data = (data + '').trim().toLowerCase();

        onKeyPress(data);

        if (key && key.ctrl && key.name === 'c') {
            printf('exiting');
            process.exit(0);
        }
    });

    printf('[troll] %s', chalk.cyan('to set error rate, type `50%` for 50% errors'));
    printf('[troll] %s', chalk.cyan('to set response delay, type `50,150` for a random delay between 50 and 150ms'));
    printf('[troll] %s', chalk.cyan('to stop trolling, type `stop`'));

}

function makeSettings(opts) {
    var settings = {};

    if (opts.argv.length !== 1) {
        throw new Error('No URL provided');
    }

    if (!/^https?:/.test(opts.argv[0])) {
        opts.argv[0] = 'http://' + opts.argv[0];
    }

    var parsedURL = url.parse(opts.argv[0]);

    settings.dest_host = parsedURL.hostname;
    settings.dest_hostname = parsedURL.hostname;
    settings.dest_protocol = parsedURL.protocol.substr(0, parsedURL.protocol.length - 1);
    settings.dest_port = parsedURL.port || portFromProtocol(settings.dest_protocol);
    settings.proxy_port = opts.options.port || config.defaultProxyPort;
    settings.accessLog = opts.options['access-log'];
    settings.replay = opts.options.replay;

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
