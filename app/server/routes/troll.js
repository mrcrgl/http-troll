'use strict';

var http = require('http'),
    troll = require('../lib/troll');

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

    setTimeout(function () {
        if (statusCode) {
            res.writeHead(statusCode);
            res.write('503 - Service unavailable');
            res.end();
            return;
        }

        var proxy_request = http.request(requestOpts, function (proxy_response) {
            // console.log('RES:', proxy_response.statusCode, '-', req.method, req.url, proxy_response.headers);
            res.writeHead(statusCode || proxy_response.statusCode, proxy_response.headers);
            proxy_response.on('data', function (chunk) {
                // console.log(chunk.toString());
                res.write(chunk);
            });
            proxy_response.on('end', function () {
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
