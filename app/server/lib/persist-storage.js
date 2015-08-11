'use strict';

var util = require('util'),
    EventEmitter = require('events').EventEmitter,
    instance;

function PersistStorage() {
    this.c = {};
}

util.inherits(PersistStorage, EventEmitter);

PersistStorage.getInstance = function (force) {
    if (!instance || force) {
        instance = new PersistStorage();
    }
    return instance;
};

PersistStorage.prototype.set = function (k, v) {
    this.emit('change', k, v);
    this.c[k] = v;
};

PersistStorage.prototype.get = function (k) {
    return this.c[k];
};

module.exports = PersistStorage;
