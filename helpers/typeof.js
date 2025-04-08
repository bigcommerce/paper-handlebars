'use strict';
const common = require('./lib/common.js');
const {ValidationError} = require("../lib/errors");

const factory = globals => {
    return function (value) {
        const options = arguments[arguments.length - 1];
        if (options.fn) {
            throw new ValidationError("Handlebars helper 'typeof' is not a block function.");
        }
        if (arguments.length-1 !== 1) {
            throw new ValidationError("Handlebars helper 'typeof' requires exactly one argument. Provided: " + (arguments.length-1));
        }
        // Possible future issue due to type conversion: future implementation of flag to disable unwrap may be advisable.
        // TODO: Add flag to disable unwrap
        const toTest = common.unwrapIfSafeString(globals.handlebars, value);
        return typeof toTest;
    };
};

module.exports = [{
    name: 'typeof',
    factory: factory,
}];
