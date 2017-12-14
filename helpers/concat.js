'use strict';

/**
 * Concats two values, primarily used as a subhelper
 * @example
 *  {{@lang (concat 'products.reviews.rating.' this) }}
 */
function helper(paper) {
    paper.handlebars.registerHelper('concat', function (value, otherValue) {
        return new paper.handlebars.SafeString(value + otherValue);
    });
}

module.exports = helper;
