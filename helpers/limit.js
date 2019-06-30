'use strict';

const _ = require('lodash');

/**
 * Limit an array to the second argument
 *
 * @example
 * {{limit array 4}}
 */
const factory = () => {
    return function(data, limit) {
        if (_.isString(data)) {
            return data.substring(0, limit);
        }
        if (!_.isArray(data)) {
            return [];
        }

        return data.slice(0, limit);
    };
};

module.exports = [{
    name: 'limit',
    factory: factory,
}];
