'use strict';

/**
 * Based on https://github.com/helpers/handlebars-helpers/blob/0.8.4/lib/string.js#L221-L233
 *
 * Return the number of occurrences of `substring` within the
 * given `string`.
 *
 * ```handlebars
 * {{occurrences "foo bar foo bar baz" "foo"}}
 * //=> 2
 * ```
 * @param  {String} `str`
 * @param  {String} `substring`
 * @return {Number} Number of occurrences
 */

const factory = () => {
    return function(str, substring) {
        if (typeof str !== 'string' || str.length === 0) {
            return 0;
        }

        if (typeof substring !== 'string' || substring.length === 0) {
            return 0;
        }

        const len = substring.length;
        let pos = 0;
        let numOccurrences = 0;

        while ((pos = str.indexOf(substring, pos)) > -1) {
            pos += len;
            numOccurrences++;
        }

        return numOccurrences;
    };
};

module.exports = [{
    name: 'occurrences',
    factory: factory,
}];
