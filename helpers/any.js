'use strict';

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
        const collection = args[0];
        const predicate = opts.hash;

        if (!utils.isEmpty(predicate)) {
            any = Object.entries(predicate).some(([key, value]) => collection.some(arg => arg[key] === value));
        } else {
            // DEPRECATED: Moved to #or helper
            // Without options hash, we check all the arguments
            any = args.some(arg => {
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
