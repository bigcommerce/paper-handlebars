'use strict';

const common = require('./lib/common.js');
/**
 * Yield block if any object within a collection matches supplied predicate
 *
 * @example
 * {{#any items selected=true}} ... {{/any}}
 */
const factory = () => {
    return function(...args) {
        let any;
        // Take the last arg (which is a Handlebars options object) out of args array
        const opts = args.pop();
        const predicate = opts.hash;

        if (!common.isEmptyObject(predicate)) {
            // With options hash, we check the contents of first argument
            const predicateKeys = Object.keys(predicate);
            const arg = args[0];

            function matchesPredicate(element, predicate) {
                for (let i = 0; i < predicateKeys.length; i++) {
                    if (!Object.is(element[predicateKeys[i]], predicate[predicateKeys[i]])) {
                        return false;
                    }
                }
                return true;
            }

            if (Array.isArray(arg)) {
                for (let i = 0; i < arg.length; i++) {
                    const element = arg[i];
                    any = matchesPredicate(element, predicate);
                    if (any) {
                        break;
                    } 
                }
            } else if (common.isObject(arg)) {
                const argIndices = Object.keys(arg);
                for (let i = 0; i < argIndices.length; i++) {
                    const element = arg[argIndices[i]];
                    any = matchesPredicate(element, predicate);
                    if (any) {
                        break;
                    }
                }
            }
        } else {
            // DEPRECATED: Moved to #or helper
            // Without options hash, we check all the arguments
            for (let i = 0; i < args.length; i++) {
                any = common.isTruthy(args[i]);
                if (any) {
                    break;
                }
            }
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