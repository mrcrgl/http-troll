'use strict';

var storage = require('./persist-storage').getInstance(),
    printf = require('./console').printf,
    chalk = require('chalk');

var troll = {
    /**
     *
     */
    stopTrolling: function () {
        storage.set('responseTimeRange', [0, 0]);
        storage.set('error503', 0.0);
        storage.set('error503Rate', [0, 0]);
        printf(chalk.green('Stopped trolling.'));
    },

    /**
     *
     * @returns {Float|undefined}
     */
    responseTime: function (minTime, maxTime) {
        if (minTime >= 0 && maxTime >= 0) {
            if (minTime > maxTime) {
                printf(chalk.red('Error: minTime should be below maxTime'));
                return;
            }

            storage.set('responseTimeRange', [minTime, maxTime]);
            printf('Set response time to: %sms - %sms', chalk.cyan(minTime), chalk.cyan(maxTime));
            return;
        }

        var responseTimeRange = storage.get('responseTimeRange'),
            responseTime = (Math.random() * (responseTimeRange[1] - responseTimeRange[0])) + responseTimeRange[0];

        return responseTime;
    },

    /**
     *
     * @returns {*}
     */
    statusCode: function (errorRate) {
        if ('number' === typeof errorRate && errorRate >= 0) {
            if (errorRate > 1.0) {
                printf(chalk.red('Error: max error rate is 1.0 (100%)'));
                return;
            }

            storage.set('error503', [0, 0]);
            storage.set('error503Rate', errorRate);
            printf('Set error rate to: %s%', chalk.cyan(errorRate * 100));
            return;
        }

        var error503 = storage.get('error503'),
            error503Rate = storage.get('error503Rate');

        var ratio = 1.0 / parseFloat(error503[0]) * parseFloat(error503[1]),
            responseCode = ratio < error503Rate ? 503 : null;

        error503[0]++;
        if (responseCode) {
            error503[1]++;
        }

        storage.set('error503', error503);

        return responseCode;
    }
};

module.exports = troll;
