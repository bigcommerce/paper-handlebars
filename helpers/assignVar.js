'use strict';
const utils = require('./3p/utils');
const max_length = 1024;
const max_keys = 50;
const { ValidationError } = require('../lib/errors');
const common = require("./lib/common");

const factory = globals => {
    return function (key, value) {
        globals.getLogger().info(`DEBUG assignVar helper called with key: ${key} and value: ${value}`);

        // Validate that key is a string
        if (!utils.isString(key)) {
            throw new ValidationError("assignVar helper key must be a string");
        }

        // Setup storage
        if (typeof globals.storage.variables === 'undefined') {
            globals.storage.variables = Object.create(null);
        }

        //Check for if the assigned value is being set to null or undefined
        if (!(value === null || value === undefined)) {

            // Due to check for string length, we need to unwrap Handlebars.SafeString
            value = common.unwrapIfSafeString(globals.handlebars, value);

            // Validate that value is a string or Number (int/float)
            if (!(utils.isString(value) || value === "") && !Number.isFinite(value)) {
                throw new ValidationError("assignVar helper value must be a string or a number (integer/float)");
            }

            // Validate that string is not longer than or equal to the max length
            if (utils.isString(value) && value.length >= max_length) {
                throw new ValidationError(`assignVar helper value must be less than ${max_length} characters, 
                but a ${value.length} character value was set to ${key}`);
            }

            // Make sure the number of total keys is within the limit
            if (Object.keys(globals.storage.variables).length >= max_keys) {
                throw new ValidationError(`Unique keys in variable storage may not exceed ${max_keys} in total`);
            }

            // Store value for later use by getVar helper
            globals.storage.variables[key] = value;
        } else {
            // Delete value from storage as it is now unset.
            delete globals.storage.variables[key];
        }
    };
};

module.exports = [{
    name: 'assignVar',
    factory: factory,
    max_length: max_length,
    max_keys: max_keys
}];
