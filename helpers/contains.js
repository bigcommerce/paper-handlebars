'use strict';

/**
 * Is any value included in a collection or a string or top level value in an object
 *
 * @example
 * {{#contains fonts "Roboto"}} ... {{/contains}}
 * {{#contains font_path "Roboto"}} ... {{/contains}}
 */
const factory = () => {
    return function(container, value) {
        const options = arguments[arguments.length - 1];
        const contained = containerIncludesValue(container, value);

        // Yield block if true
        if (contained) {
            return options.fn(this);
        } else {
            return options.inverse(this);
        }
    };
};

const containerIncludesValue = (container, value) => {
    switch (typeof container) {
        case 'string':
            return container.includes(value);
        case 'object':
            if (container) {
                if  (Array.isArray(container)) {
                    return container.includes(value);
                }

                // Check if the supplied value matches a top level value in the container object
                return Object.values(container).some(objValue => {
                    if (objValue && value) {
                        return JSON.stringify(objValue) === JSON.stringify(value);
                    }
                });
            }
        default:
            return false;
    }
};

module.exports = [{
    name: 'contains',
    factory: factory,
}];
