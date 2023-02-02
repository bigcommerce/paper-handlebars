'use strict';


const utils = require('./3p/utils');

/**
 * Is any value included in a collection or a string?
 *
 * @example
 * {{#contains fonts "Roboto"}} ... {{/contains}}
 * {{#contains font_path "Roboto"}} ... {{/contains}}
 */
const factory = () => {
    return function(container, value) {
        const options = arguments[arguments.length - 1];
        const preparedContainer = utils.isObject(container) ? Object.values(container) : container;
        const contained = preparedContainer ? preparedContainer.includes(value) : false;

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
