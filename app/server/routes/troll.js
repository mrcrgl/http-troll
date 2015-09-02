'use strict';

var http = require('http'),
    troll = require('../lib/troll'),
    replayCache = {};

function routeTroll(req, res, options) {
    req.headers.host = options.dest_host;

    var requestOpts = {
        hostname: options.dest_host,
        port: options.dest_port,
        path: req.url,
        method: req.method,
        headers: req.headers
    };

    var responseTime = troll.responseTime();
    var statusCode = troll.statusCode();

    var b = [];

    var record = function (data) {
        if (options.replay) {
            b.push(data);
        }
    };

    var save = function (res) {
        if (options.replay) {
            replayCache[req.url] = {
                headers: res.headers,
                statusCode: res.statusCode,
                body: b
            };
        }
    };

    setTimeout(function () {
        if (statusCode) {
            res.writeHead(statusCode);
            res.write('503 - Service unavailable');
            res.end();
            return;
        }

        if (options.replay && replayCache[req.url]) {
            var c = replayCache[req.url];
            res.writeHead(c.statusCode, c.headers);
            c.body.forEach(res.write.bind(res));
            res.end();

            return;
        }

        var proxy_request = http.request(requestOpts, function (proxy_response) {
            // console.log('RES:', proxy_response.statusCode, '-', req.method, req.url, proxy_response.headers);
            res.writeHead(statusCode || proxy_response.statusCode, proxy_response.headers);
            proxy_response.on('data', function (chunk) {
                record(chunk);

                res.write(chunk);
            });
            proxy_response.on('end', function () {
                save(proxy_response);
                res.end();
            });
        });

        req.on('data', function (chunk) {
            // console.log(chunk.toString());
            proxy_request.write(chunk);
        });
        req.on('end', function () {
            proxy_request.end();
        });
    }, responseTime);
}

module.exports = routeTroll;
