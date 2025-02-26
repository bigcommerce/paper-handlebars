'use strict';

const utils = require('./3p/utils');
const { ValidationError } = require('../lib/errors');

const factory = globals => {
    return function (key) {
        if (!utils.isString(key)) {
            throw new ValidationError("getVar helper key must be a string");
        }

        return globals.storage.variables && Object.hasOwnProperty.call(globals.storage.variables, key) ? globals.storage.variables[key] : undefined
    };
};

module.exports = [{
    name: 'getVar',
    factory: factory,
}];
