'use strict';

var util = require('util');

var cons = {
    printf: function (message) {
        console.log(util.format.apply(null, arguments));
    }
};

module.exports = cons;
