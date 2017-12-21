'use strict';

var _ = require('lodash');

const factory = () => {
    return function(collection, path) {
        return _.pluck(collection, path);
    };
};

module.exports = [{
    name: 'pluck',
    factory: factory,
}];
