'use strict';

const utils = require('./3p/utils');
const deepMatches = require('./3p/utils/lib/deepMatches');

/**
 * Yield block if any object within a collection matches supplied predicate
 *
 * @example
 * {{#any items selected=true}} ... {{/any}}
 */
const factory = () => {
    return function (...args) {

        let any;
        // Take the last arg which is a Handlebars options object out of args array
        const opts = args.pop();
        const predicate = opts.hash;

        if (!utils.isEmpty(predicate)) {
            if (utils.isArray(args[0])) {
                // With options hash, we check the contents of first argument
                any = args[0].some((v) => deepMatches(v, predicate));
            }
        } else {
            // DEPRECATED: Moved to #or helper
            // Without options hash, we check all the arguments
            any = args.some(function (arg) {
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
