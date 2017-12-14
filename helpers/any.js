'use strict';

var _ = require('lodash');

/**
 * Yield block if any object within a collection matches supplied predicate
 *
 * @example
 * {{#any items selected=true}} ... {{/any}}
 */
function helper(paper) {
    paper.handlebars.registerHelper('any', function () {

        var args = [],
            opts,
            predicate,
            any;

        // Translate arguments to array safely
        for (var i = 0; i < arguments.length; i++) {
            args.push(arguments[i]);
        }

        // Take the last argument (content) out of testing array
        opts = args.pop();
        predicate = opts.hash;

        if (!_.isEmpty(predicate)) {
            // With options hash, we check the contents of first argument
            any = _.any(args[0], predicate);
        } else {
            // DEPRECATED: Moved to #or helper
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
        }

        if (any) {
            return opts.fn(this);
        }

        return opts.inverse(this);
    });
}

module.exports = helper;
