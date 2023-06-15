'use strict';
const { ValidationError } = require('../lib/errors');

/**
 * Format numbers
 *
 * @param integer n: length of decimal
 * @param mixed   s: thousands delimiter
 * @param mixed   c: decimal delimiter
 */
function numberFormat(value, n, s, c) {
    var re = '\\d(?=(\\d{3})+' + (n > 0 ? '\\D' : '$') + ')',
        num = value.toFixed(Math.max(0, ~~n));

    return (c ? num.replace('.', c) : num).replace(new RegExp(re, 'g'), '$&' + (s || ','));
}

const factory = globals => {
    return function(...args) {
        const siteSettings = globals.getSiteSettings();
        const money = siteSettings.money;

        // remove options hash object
        args.pop();

        let value = args[0];

        if (isNaN(value)) {
            throw new ValidationError("money helper accepts only Number's as first parameter");
        }

        const decimalPlaces = args[1] || money.decimal_places;

        if (isNaN(decimalPlaces)) {
            throw new ValidationError("money helper accepts only Number's for decimal places");
        }
        const thousandsToken = args[2] || money.thousands_token;
        const decimalToken = args[3] || money.decimal_token;

        value = numberFormat(
            value,
            decimalPlaces,
            thousandsToken,
            decimalToken
        );

        return money.currency_location.toLowerCase() === 'left'
            ? money.currency_token + ' ' + value
            : value + ' ' + money.currency_token;
    };
};

module.exports = [{
    name: 'money',
    factory: factory,
}];
