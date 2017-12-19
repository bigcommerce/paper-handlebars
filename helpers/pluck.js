'use strict';

var _ = require('lodash');

const factory = globals => {
    return function(collection, path) {
        return _.pluck(collection, path);
    };
};

module.exports = [{
    name: 'pluck',
    factory: factory,
}];
