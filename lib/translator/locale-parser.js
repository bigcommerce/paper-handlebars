'use strict';

/**
 * @module paper/lib/translator/locale-parser
 */

const _ = require('lodash');
const AcceptLanguageParser = require('accept-language-parser');
const Logger = require('../logger');
const MessageFormat = require('messageformat');

/**
 * Get preferred locale
 * @param {string} acceptLanguage
 * @param {Object} languages
 * @returns {string}
 */
function getPreferredLocale(acceptLanguage, languages, defaultLocale) {
    const locales = getLocales(acceptLanguage);
    let preferredLocale = defaultLocale;

    _.each(locales, locale => {
        if (languages[locale]) {
            preferredLocale = locale;

            return false;
        }
    });

    return normalizeLocale(preferredLocale, defaultLocale);
}

/**
 * Parse locale header
 * @param {string} acceptLanguage
 * @returns {string[]} Locales
 */
function getLocales(acceptLanguage) {
    const localeObjects = AcceptLanguageParser.parse(acceptLanguage);

    return _.map(localeObjects, localeObject => {
        return _.isString(localeObject.region) ? `${localeObject.code}-${localeObject.region}` : localeObject.code;
    });
}

/**
 * Normalize locale
 * @private
 * @param {string} locale
 * @returns {string}
 */
function normalizeLocale(locale, defaultLocale) {
    try {
        new MessageFormat(locale);

        return locale;
    } catch (err) {
        Logger.log(err);

        return defaultLocale;
    }
}

module.exports = {
    getPreferredLocale: getPreferredLocale,
    getLocales: getLocales,
};
