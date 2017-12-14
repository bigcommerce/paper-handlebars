'use strict';

var _ = require('lodash');

/**
 * Yield block if any object within a collection matches supplied predicate
 *
 * @example
 * {{#or 1 0 0 0 0 0}} ... {{/or}}
 */
function helper(paper) {
    paper.handlebars.registerHelper('or', function () {
        var args = [],
            opts,
            any;

        // Translate arguments to array safely
        for (var i = 0; i < arguments.length; i++) {
            args.push(arguments[i]);
        }

        // Take the last argument (content) out of testing array
        opts = args.pop();

        // Without options hash, we check all the arguments
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

        if (any) {
            return opts.fn(this);
        }

        return opts.inverse(this);
    });
}

module.exports = helper;
