'use strict';
const common = require('./lib/common.js');
const {ValidationError} = require("../lib/errors");

const factory = globals => {
    return function (data) {
        arguments.pop(); // remove Options
        if (arguments.length !== 1) {
            throw new ValidationError("Handlebars helper 'typeof' requires exactly one argument.");
        }
        // Possible future issue due to type conversion: future implementation of flag to disable unwrap may be advisable.
        // TODO: Add flag to disable unwrap
        data = common.unwrapIfSafeString(globals.handlebars, data);
        return typeof data;
    };
};

module.exports = [{
    name: 'typeof',
    factory: factory,
}];
