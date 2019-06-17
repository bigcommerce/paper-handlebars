'use strict';

const common = require('./lib/common.js');
/**
 * Yield block if any object within a collection matches supplied predicate
 *
 * @example
 * {{#or 1 0 0 0 0 0}} ... {{/or}}
 */
const factory = () => {
    return function(...args) {
        // Take the last arg (which is a Handlebars options object) out of args array
        const opts = args.pop();
        let any;

        for (let i = 0; i < args.length; i++) {
            any = common.isTruthy(args[i]);
            if (any) {
                break;
            }
        }

        if (any) {
            return opts.fn(this);
        }

        return opts.inverse(this);
    };
}

module.exports = [{
    name: 'or',
    factory: factory,
}];