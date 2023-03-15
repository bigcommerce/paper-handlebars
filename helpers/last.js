'use strict';

const utils = require('./3p/utils');

var helpers = module.exports;

/**
 * Returns the last item, or last `n` items of an array.
 * Opposite of [first](#first).
 *
 * Given the array `['a', 'b', 'c', 'd', 'e']`:
 *
 * ```handlebars
 * {{last array 2}}
 * //=> '["d", "e"]'
 * ```
 * Given the string `'abcde'`:
 *
 * ```handlebars
 * {{last string 2}}
 * //=> `'de'`
 * ```
 *
 * @param {Array} `array`
 * @param {Number} `n` Number of items to return, starting with the last item.
 * @return {Array}
 * @api public
 */

helpers.last = function(array, n) {
    if (Array.isArray(array)) {
        return arrayAlt(array, n);
    }

    if (utils.isString(array)) {
        return stringAlt(array, n);
    }

    return [];
};

function arrayAlt(array, n) {
    if (!utils.isNumber(n)) {
        return array[array.length - 1];
    }
    return array.slice(-n);
}

function stringAlt(str, n) {
    const chars = str.split('');
    const arr = arrayAlt(chars, n);
    return arr.join('');
}