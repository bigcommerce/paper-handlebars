'use strict';
const _ = require('lodash');
const common = require('./lib/common.js');
const utils = require('handlebars-utils');

/**
 * Concats multi values, primarily used as a subhelper
 * @example
 *  {{multiConcat "string1" "string2" "string3"}}
 */


const factory = globals => {
    return function(...args) {
        // Take the last arg which is a Handlebars options object out of args array
        args.pop();

        // Check if all the args are valid / truthy
        const result = _.every(args, function (arg) {
            if (utils.isArray(arg)) {
                return !!arg.length;
            }
            // If an empty object is passed, arg is false
            else if (utils.isEmpty(arg) && utils.isObject(arg)) {
                return false;
            }
            // Everything else
            else {
                return !!arg;
            }
        });

        if (result) {
            return args.join('');
        }

    };

};


module.exports = [{
    name: 'multiConcat',
    factory: factory,
}];
