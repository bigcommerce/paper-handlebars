'use strict';

const utils = require('./3p/utils');

const factory = globals => {
    return function (key) {
        if (!utils.isString(key)) {
            throw new Error("getVar helper key must be a string");
        }

        return globals.storage.variables && globals.storage.variables.hasOwnProperty(key) ? globals.storage.variables[key] : undefined
    };
};

module.exports = [{
    name: 'getVar',
    factory: factory,
}];
