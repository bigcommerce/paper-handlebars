'use strict';
const utils = require('./3p/utils');
const max_length = 1024;
const max_keys = 50;
const { ValidationError } = require('../lib/errors');

const factory = globals => {
    return function (key, value) {

        // Validate that key is a string
        if (!utils.isString(key)) {
            throw new ValidationError("assignVar helper key must be a string");
        }

        // Validate that value is a string or Number (int/float)
        if (!utils.isString(value) && !Number.isFinite(value)) {
            throw new ValidationError("assignVar helper value must be a string or a number (integer/float)");
        }

        // Validate that string is not longer than the max length
        if (utils.isString(value) && value.length >= max_length) {
            throw new ValidationError(`assignVar helper value must be less than ${max_length} characters, 
                but a ${value.length} character value was set to ${key}`);
        }

        // Setup storage
        if (typeof globals.storage.variables === 'undefined') {
            globals.storage.variables = Object.create(null);
        }

        // Make sure the number of total keys is within the limit
        if (Object.keys(globals.storage.variables).length >= max_keys) {
            throw new ValidationError(`Unique keys in variable storage may not exceed ${max_keys} in total`);
        }

        // Store value for later use by getVar helper
        globals.storage.variables[key] = value;
    };
};

module.exports = [{
    name: 'assignVar',
    factory: factory,
}];
