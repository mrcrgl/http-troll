'use strict';

var storage = require('../lib/persist-storage').getInstance(),
    configHeaders = ['error-503', 'response-times'];

function routeConfiguration(req, res) {
    Object.keys(req.headers).filter(filterConfigHeaders).forEach(function (header) {
        switch (header) {
            case 'error-503':
                storage.set('error503', [0, 0]);
                storage.set('error503Rate', parseFloat(req.headers['error-503']));
                console.log('configure 503 rate: ', storage.get('error503Rate'));
                break;

            case 'response-times':
                var responseTimeRange = req.headers['response-times'].trim().split(',').map(function (c) {
                    return parseInt(c);
                });
                storage.set('responseTimeRange', responseTimeRange);
                console.log('configure response times: ', responseTimeRange);
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
