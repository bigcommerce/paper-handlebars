'use strict';
const utils = require('handlebars-utils');
// Detect ICU support
const { hasFullICU } = require('./lib/icu-detect.js');

const factory = () => {
    return function(price, locale) {
        if (!utils.isObject(price) || !utils.isString(price.currency)
            || isNaN(price.value) || !utils.isString(price.formatted)) {
            // Return empty string if this does not appear to be a price object
            return ''
        }

        if (!utils.isString(locale) || locale.length < 2) {
            // Valid browser language strings are at least two characters
            // https://www.metamodpro.com/browser-language-codes
            // If provided locale is less than two characters (or not a string),
            // return the normal formatted price
            return price.formatted;
        }

        // If the if full ICU is not installed, fall back to normal price
        if (!hasFullICU){
            return price.formatted;
        }

        // Try to format the price to the provided locale,
        // but if anything goes wrong,
        // just return the usual price
        // Could happen if the full ICU is not installed,
        // or if an invalid locale is provided.
        try {
            return new Intl.NumberFormat(
                locale, { style: 'currency', currency: price.currency}
            ).format(price.value);
        }
        catch (err){
            return price.formatted;
        }
    };
};

module.exports = [{
    name: 'localizePrice',
    factory: factory,
}];
