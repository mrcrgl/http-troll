'use strict';

var http = require('http'),
    routeConfiguration = require('./routes/configure'),
    routeTroll = require('./routes/troll'),
    printf = require('../console').printf,
    chalk = require('chalk');

var storage = require('./lib/persist-storage').getInstance();

// Set defaults
storage.set('responseTimeRange', [0, 0]);
storage.set('error503Rate', 0);
storage.set('error503', [0, 0]);

/**
 *
 * @param callback
 */
function startServer(options, callback) {
    var server = http.createServer(function (req, res) {
        var originalEnd = res.end;

        var startTime = Date.now();

        res.end = function () {
            if (options.accessLog) {
                printf('%d - %s %s - %dms', res.statusCode, req.method, req.url, Date.now() - startTime);
            }

            originalEnd.apply(res, arguments);
        };

        if (req.url === '/configure') {
            routeConfiguration(req, res);
        } else {
            routeTroll(req, res, options);
        }

    });

    server.listen(parseInt(options.proxy_port), function (err) {
        printf(
            'Troll proxy listening on ' + chalk.cyan('%s:%d') + '; destination host: ' +
            chalk.cyan('%s://%s:%d'),
            server.address().address,
            server.address().port,
            options.dest_protocol,
            options.dest_host,
            options.dest_port
        );

        if (callback) {
            callback(err, server);
        }
    });
}

module.exports = startServer;
