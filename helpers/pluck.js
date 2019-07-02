'use strict';

var _ = require('lodash');

const factory = () => {
    return function(collection, path) {
        return _.map(collection, item => item[path]);
    };
};

module.exports = [{
    name: 'pluck',
    factory: factory,
}];
