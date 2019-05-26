'use strict';

const _ = require('lodash');

/**
 * Yield block if any object within a collection matches supplied predicate
 *
 * @example
 * {{#any items selected=true}} ... {{/any}}
 */
const factory = () => {
    return function(...args) {
        var opts,
            predicate,
            any;

        // Take the last arg (content) out of testing array
        opts = args.pop();
        predicate = opts.hash;

        if (!_.isEmpty(predicate)) {
            // With options hash, we check the contents of first arg
            any = _.any(args[0], predicate);
        } else {
            // DEPRECATED: Moved to #or helper
            // Without options hash, we check all the args
            any = _.any(args, function (arg) {
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
