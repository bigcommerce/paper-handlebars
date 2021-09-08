'use strict';
const common = require('./lib/common.js');

const factory = globals => {
    return function(needle, haystack) {
        needle = common.unwrapIfSafeString(globals.handlebars, needle);
        haystack = common.unwrapIfSafeString(globals.handlebars, haystack);
        const options = arguments[arguments.length - 1];

        if (typeof needle !== 'string') {
            return options.inverse(this);
        }

        const regex = new RegExp(escapeRegex(needle), 'g');

        // Yield block if true
        if (typeof haystack === 'string' && regex.test(haystack)) {
            return haystack.replace(regex, options.fn(this));
        } else {
            return options.inverse(this);
        }
    };
};

function escapeRegex(string) {
    return string.replace(/[-\\^$*+?.()|[\]{}]/g, "\\$&");
}

module.exports = [{
    name: 'replace',
    factory: factory,
}];
