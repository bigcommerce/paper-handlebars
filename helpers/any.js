'use strict';

const _ = require('lodash');
const utils = require('handlebars-utils');

/**
 * Yield block if any object within a collection matches supplied predicate
 *
 * @example
 * {{#any items selected=true}} ... {{/any}}
 */
const factory = () => {
    return function(...args) {

        let any;
        // Take the last arg which is a Handlebars options object out of args array
        const opts = args.pop();
        const predicate = opts.hash;

        if (!utils.isEmpty(predicate)) {
            // With options hash, we check the contents of first argument
            any = _.some(args[0], predicate);
        } else {
            // DEPRECATED: Moved to #or helper
            // Without options hash, we check all the arguments
            any = _.some(args, function (arg) {
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
        }

        if (any) {
            return opts.fn(this);
        }

        return opts.inverse(this);
    };
};

module.exports = [{
    name: 'any',
    factory: factory,
}];
