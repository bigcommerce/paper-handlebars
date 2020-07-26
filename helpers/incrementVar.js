'use strict';
const utils = require('handlebars-utils');
const max_keys = 50;

const factory = globals => {
    return function(key) {
        if (!utils.isString(key)) {
            throw new Error("incrementVar helper key must be a string");
        }

        // Setup storage
        if (typeof globals.storage.variables === 'undefined') {
            globals.storage.variables = {};
        }

        if (Number.isInteger(globals.storage.variables[key])) {
            // Increment value if it already exists
            globals.storage.variables[key] += 1;
        } else {
            // Make sure the number of total keys is within the limit
            if (Object.keys(globals.storage.variables).length >= max_keys) {
                throw new Error(`Unique keys in variable storage may not exceed ${max_keys} in total`);
            }
            // Initialize or re-initialize value
            globals.storage.variables[key] = 0;
        }

        // Return current value
        return globals.storage.variables[key];
    };
};

module.exports = [{
    name: 'incrementVar',
    factory: factory,
}];
