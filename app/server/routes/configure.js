'use strict';

var storage = require('../lib/persist-storage').getInstance(),
    troll = require('../lib/troll'),
    configHeaders = ['error-503', 'response-times'];

function routeConfiguration(req, res) {
    Object.keys(req.headers).filter(filterConfigHeaders).forEach(function (header) {
        switch (header) {
            case 'error-503':
                troll.statusCode(parseFloat(req.headers['error-503']));
                break;

            case 'response-times':
                var responseTimeRange = req.headers['response-times'].trim().split(',').map(function (c) {
                    return parseInt(c);
                });
                troll.responseTime.apply(null, responseTimeRange);
                break;
        }
    });

    res.writeHead(200);
    res.write('OK');
    res.end();
}

function filterConfigHeaders(v) {
    return configHeaders.indexOf(v) !== -1;
}

module.exports = routeConfiguration;
