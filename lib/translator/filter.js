'use strict';

/**
 * @module paper/lib/translator/filter
 */

const _ = require('lodash');

/**
 * Filter translation by key
 * @param {Object.<string, string>} language
 * @param {string} keyFilter
 * @returns {Object.<string, string>}
 */
function filterByKey(language, keyFilter) {
    return _.transform(language, (result, value, key) => {
        if (key === 'translations' || key === 'locales') {
            result[key] = _.pick(value, (innerValue, innerKey) => innerKey.indexOf(keyFilter) === 0);
        } else {
            result[key] = value;
        }
    });
}

module.exports = {
    filterByKey: filterByKey,
};
