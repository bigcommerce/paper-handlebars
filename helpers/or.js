'use strict';

const _ = require('lodash');

/**
 * Yield block if any object within a collection matches supplied predicate
 *
 * @example
 * {{#or 1 0 0 0 0 0}} ... {{/or}}
 */
const factory = () => {
    return function(...args) {

        // Take the last arg which is a Handlebars options object out of args array
        const opts = args.pop();

        // Evaluate all args in args array to see if any are truthy
        const any = _.some(args, function (arg) {
            if (_.isArray(arg)) {
                return !!arg.length;
            }
            // If an empty object is passed, arg is false
            else if (_.isEmpty(arg) && _.isObject(arg)) {
                return false;
            }
            // Everything else
            else {
                return !!arg;
            }
        });

        if (any) {
            return opts.fn(this);
        }

        return opts.inverse(this);
    };
};

module.exports = [{
    name: 'or',
    factory: factory,
}];
