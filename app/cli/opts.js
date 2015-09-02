'use strict';

var GetOpt = require('node-getopt'),
    chalk = require('chalk');

var getopt = new GetOpt([
    ['p', 'port=ARG', 'port for proxy to listen on'],
    ['l', 'access-log', 'print access log'],
    ['r', 'replay', 'replays previously made calls'],
    ['', 'no-comment'],
    ['h', 'help', 'display this help']/*,
    ['v', 'version', 'show version']*/
]);

getopt.setHelp(
    chalk.green('http trolling proxy\n') +
    'Can vary response times and simulate flattering availability (HTTP 503 ratio)\n' +
    '\n' +
    'Usage: troll http://example.com [OPTIONS]\n' +
    '\n' +
    chalk.grey('[[OPTIONS]]\n') +
    '\n' +
    'Configurations can be made via HTTP call to ' + chalk.cyan('GET /configure') + '\n' +
    'Set header:\n' +
    '  response-times: 50,200\tadd response time random between 50ms and 200ms\n' +
    '  error-503: 0.4\t\tset\'s HTTP 503 responses to 40%\n' +
    '\n' +
    'Respository:  https://github.com/mrcrgl/http-troll'
);

module.exports = {
    getopt: getopt,
    opts: getopt.parseSystem()
};
