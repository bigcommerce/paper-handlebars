'use strict';
const SafeString = require('handlebars').SafeString;

/**
 * Concats two values, primarily used as a subhelper
 * @example
 *  {{@lang (concat 'products.reviews.rating.' this) }}
 */
const factory = globals => {
    return function(value, otherValue) {
        return new SafeString(value + otherValue);
    };
};

module.exports = [{
    name: 'concat',
    factory: factory,
}];
