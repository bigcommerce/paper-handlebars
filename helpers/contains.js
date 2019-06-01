'use strict';

const common = require('./lib/common.js');
/**
 * Is any value included in a collection or a string?
 *
 * @example
 * {{#contains fonts "Roboto"}} ... {{/contains}}
 * {{#contains font_path "Roboto"}} ... {{/contains}}
 */
const factory = () => {
    return function(container, value, options) {
        let contained;

        if (Array.isArray(container) || common.isString(container)) {
            contained = container.includes(value);
        } else if (common.isObject(container)) {
            contained = Object.values(container).includes(value);
        }

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
