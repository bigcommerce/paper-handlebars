'use strict';
const common = require('./lib/common.js');
/**
 * Limit an array to the second argument
 *
 * @example
 * {{limit array 4}}
 */
const factory = () => {
    return function(data, limit) {
        if (common.isString(data)) {
            return data.substring(0, limit);
        }
        if (!Array.isArray(data)) {
            return [];
        }

        return data.slice(0, limit);
    };
};

module.exports = [{
    name: 'limit',
    factory: factory,
}];