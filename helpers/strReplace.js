'use strict';
const common = require('./lib/common.js');
const { ValidationError } = require('../lib/errors');

const factory = globals => {
    return function (str, substr, newSubstr, iteration) {
        str = common.unwrapIfSafeString(globals.handlebars, str);
        substr = common.unwrapIfSafeString(globals.handlebars, substr);
        newSubstr = common.unwrapIfSafeString(globals.handlebars, newSubstr);
        iteration = common.unwrapIfSafeString(globals.handlebars, iteration);

        if (typeof str !== 'string') {
            throw new ValidationError("Invalid query parameter string passed to strReplace");
        } else if (typeof substr !== 'string') {
            throw new ValidationError("Invalid query parameter substring passed to strReplace");
        } else if (typeof newSubstr !== 'string') {
            throw new ValidationError("Invalid query parameter new substring passed to strReplace");
        }

        if (typeof iteration !== 'number') {
            return str.replace(new RegExp(escapeRegex(substr), 'g'), newSubstr);
        }

        const occurrence = getOccurrences(str, substr);

        if (iteration > 0 && occurrence > 0) {
            if (iteration >= occurrence) {
                return str.replace(new RegExp(escapeRegex(substr), 'g'), newSubstr);
            } else {
                let result = str;
                for (let i = 0; i < iteration; i++) {
                    result = result.replace(substr, newSubstr);
                }
                return result;
            }
        } else {
            return str;
        }
    };
};

function escapeRegex(string) {
    return string.replace(/[-\\^$*+?.()|[\]{}]/g, "\\$&");
}

function getOccurrences(str, substr) {
    const matches = str.match(new RegExp(escapeRegex(substr), 'g'));
    return matches ? matches.length : 0;
}

module.exports = [{
    name: 'strReplace',
    factory: factory,
}];
