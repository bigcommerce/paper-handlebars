'use strict';

/**
 * @module paper/lib/translator/transformer
 */

const _ = require('lodash');
const Logger = require('../logger');

/**
 * Transform translations
 * @param {Object} allTranslations
 * @param {string} defaultLocale
 * @returns {Object.<string, Object>} Transformed translations
 */
function transform(allTranslations, defaultLocale) {
    return cascade(flatten(allTranslations), defaultLocale);
}

/**
 * Flatten translations
 * @param {Object} allTranslations
 * @returns {Object.<string, Object>} Flatten translations
 */
function flatten(allTranslations) {
    return _.transform(allTranslations, (result, translation, locale) => {
        try {
            result[locale] = flattenObject(translation);
        } catch (err) {
            Logger.log(`Failed to parse ${locale} - Error: ${err}`);

            result[locale] = {};
        }
    }, {});
}

/**
 * Cascade translations
 * @param {Object} allTranslations Flattened translations
 * @param {string} defaultLocale
 * @returns {Object.<string, Object>} Language objects
 */
function cascade(allTranslations, defaultLocale) {
    return _.transform(allTranslations, (result, translations, locale) => {
        const regionCodes = locale.split('-');

        for (let regionIndex = regionCodes.length - 1; regionIndex >= 0; regionIndex--) {
            const parentLocale = getParentLocale(regionCodes, regionIndex, defaultLocale);
            const parentTranslations = allTranslations[parentLocale] || {};
            const translationKeys = _.union(Object.keys(parentTranslations), Object.keys(translations));

            if (!result[locale]) {
                result[locale] = { locale: locale, locales: {}, translations: {} };
            }

            _.each(translationKeys, key => {
                if (translations[key]) {
                    result[locale].locales[key] = locale;
                    result[locale].translations[key] = translations[key];
                } else if (!result[locale].translations[key]) {
                    result[locale].locales[key] = parentLocale;
                    result[locale].translations[key] = parentTranslations[key];
                }
            });
        }
    }, {});
}

/**
 * Get parent locale
 * @private
 * @param {string[]} regionCodes
 * @param {number} regionIndex
 * @param {string} defaultLocale
 * @returns {string} Parent locale
 */
function getParentLocale(regionCodes, regionIndex, defaultLocale) {
    if (regionIndex === 0 && regionCodes[0] !== defaultLocale) {
        return defaultLocale;
    }

    return regionCodes.slice(0, regionIndex).join('-');
}

/**
 * Brings nested JSON parameters to the top level while preserving namespaces with . as a delimiter
 * @private
 * @param {Object} object
 * @param {Object} [result={}]
 * @param {string} [parentKey='']
 * @returns {Object} Flatten object
 */
function flattenObject(object, result, parentKey) {
    result = result || {};
    parentKey = parentKey || '';

    _.forOwn(object, (value, key) => {
        const resultKey = parentKey ? `${parentKey}.${key}` : key;

        if (_.isObject(value)) {
            return flattenObject(value, result, resultKey);
        }

        result[resultKey] = value;
    });

    return result;
}

module.exports = {
    cascade: cascade,
    flatten: flatten,
    transform: transform,
};
