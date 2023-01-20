'use strict';
const common = require('./lib/common.js');
<<<<<<< HEAD
const utils = require('handlebars-utils');

const factory = globals => {
    return function(str, substr, newSubstr, iteration) {
=======
const utils = require('./3p/utils');

const factory = globals => {
    return function (str, substr, newSubstr, iteration) {
>>>>>>> bigcommerce-master
        str = common.unwrapIfSafeString(globals.handlebars, str);
        substr = common.unwrapIfSafeString(globals.handlebars, substr);
        newSubstr = common.unwrapIfSafeString(globals.handlebars, newSubstr);
        iteration = common.unwrapIfSafeString(globals.handlebars, iteration);

<<<<<<< HEAD
        if (!utils.isString(str)){
            throw new TypeError("Invalid query parameter string passed to strReplace");
        } else if (!utils.isString(substr)){
            throw new TypeError("Invalid query paramter substring passed to strReplace");
        } else if(!utils.isString(newSubstr)) {
=======
        if (!utils.isString(str)) {
            throw new TypeError("Invalid query parameter string passed to strReplace");
        } else if (!utils.isString(substr)) {
            throw new TypeError("Invalid query paramter substring passed to strReplace");
        } else if (!utils.isString(newSubstr)) {
>>>>>>> bigcommerce-master
            throw new TypeError("Invalid query parameter new substring passed to strReplace");
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
<<<<<<< HEAD
    const matches = str.match(new RegExp(escapeRegex(substr),'g'));
=======
    const matches = str.match(new RegExp(escapeRegex(substr), 'g'));
>>>>>>> bigcommerce-master
    return matches ? matches.length : 0;
}

module.exports = [{
    name: 'strReplace',
    factory: factory,
}];
