'use strict';

const _ = require('lodash');

/**
 * Is any value included in a collection or a string?
 *
 * @example
 * {{#contains fonts "Roboto"}} ... {{/contains}}
 * {{#contains font_path "Roboto"}} ... {{/contains}}
 */
const factory = globals => {
    return function() {
        var args = Array.prototype.slice.call(arguments, 0, -1),
            options = _.last(arguments),
            contained = _.contains.apply(_, args);

        // Yield block if true
        if (contained) {
            return options.fn(this);
        } else {
            return options.inverse(this);
        }
    };
};

module.exports = [{
    name: 'contains',
    factory: factory,
}];
