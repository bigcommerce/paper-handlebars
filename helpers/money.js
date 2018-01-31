'use strict';

const _ = require('lodash');

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
    return function(value) {
        const siteSettings = globals.getSiteSettings();
        const money = siteSettings.money;

        if (!_.isNumber(value)) {
            return '';
        }

        value = numberFormat(
            value,
            money.decimal_places,
            money.thousands_token,
            money.decimal_token
        );

        return money.currency_location === 'left'
            ? money.currency_token + ' ' + value
            : value + ' ' + money.currency_token;
    };
};

module.exports = [{
    name: 'money',
    factory: factory,
}];
