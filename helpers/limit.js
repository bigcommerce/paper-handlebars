'use strict';

const utils = require('handlebars-utils');

/**
 * Limit an array to the second argument
 *
 * @example
 * {{limit array 4}}
 */
const factory = () => {
    return function(data, limit) {
        if (utils.isString(data)) {
            return data.substring(0, limit);
        }
        if (!utils.isArray(data)) {
            return [];
        }

        return data.slice(0, limit);
    };
};

module.exports = [{
    name: 'limit',
    factory: factory,
}];
