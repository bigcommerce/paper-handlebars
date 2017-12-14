'use strict';

var _ = require('lodash');

/**
 * Yield block only if all arguments are valid
 *
 * @example
 * {{#all items theme_settings.optionA theme_settings.optionB}} ... {{/all}}
 */
function helper(paper) {
    paper.handlebars.registerHelper('all', function () {

        var args = [], opts, result;

        // Translate arguments to array safely
        for (var i = 0; i < arguments.length; i++) {
            args.push(arguments[i]);
        }

        // Take the last argument (content) out of testing array
        opts = args.pop();

        // Check if all the arguments are valid / truthy
        result = _.all(args, function (arg) {
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

        // If everything was valid, then "all" condition satisfied
        if (result) {
            return opts.fn(this);
        } else {
            return opts.inverse(this);
        }
    });
}

module.exports = helper;
