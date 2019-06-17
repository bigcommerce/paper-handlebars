'use strict';
const common = require('./lib/common.js');
/**
 * Yield block only if all arguments are valid
 *
 * @example
 * {{#all items theme_settings.optionA theme_settings.optionB}} ... {{/all}}
 */
const factory = () => {
    return function(...args) {
        // Take the last arg (which is a Handlebars options object) out of args array
        const opts = args.pop();
        // Check if all the arguments are valid / truthy
        let result;
        for (let i = 0; i < args.length; i++) {
            result = common.isTruthy(args[i]);
            if (!result) {
                break;
            }
        }
        // If everything was valid, then "all" condition satisfied
        if (result) {
            return opts.fn(this);
        } else {
            return opts.inverse(this);
        }
    };
};

module.exports = [{
    name: 'all',
    factory: factory,
}];