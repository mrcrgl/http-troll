'use strict';

var storage = require('./persist-storage').getInstance();

var troll = {
    /**
     *
     * @returns {Float}
     */
    responseTime: function () {
        var responseTimeRange = storage.get('responseTimeRange'),
            responseTime = (Math.random() * (responseTimeRange[1] - responseTimeRange[0])) + responseTimeRange[0];

        return responseTime;
    },

    /**
     *
     * @returns {*}
     */
    statusCode: function () {
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
