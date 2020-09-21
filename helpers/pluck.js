'use strict';

const helpers = require('handlebars-helpers');

const factory = () => {
    return function(collection, path) {
        if (typeof path !== 'string') {
            return '';
        }

        if (Array.isArray(collection)) {
            let res = [];
            for (let i = 0; i < collection.length; i++) {
                const val = helpers.utils.get(collection[i], path);
                if (typeof val !== 'undefined') {
                    res.push(val);
                }
            }
            return res;
        }

        if (typeof collection === 'object') {
            const result = helpers.utils.get(collection, path);
            return result ? result : '';
        }
        return '';
    };
};

module.exports = [{
    name: 'pluck',
    factory: factory,
}];
