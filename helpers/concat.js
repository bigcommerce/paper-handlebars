'use strict';

/**
 * Concats two values, primarily used as a subhelper
 * @example
 *  {{@lang (concat 'products.reviews.rating.' this) }}
 */
const factory = globals => {
    return function(value, otherValue) {
        return new globals.handlebars.SafeString(value + otherValue);
    };
};

module.exports = [{
    name: 'concat',
    factory: factory,
}];
