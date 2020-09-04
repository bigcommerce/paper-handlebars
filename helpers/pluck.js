'use strict';

const factory = () => {
    return function(collection, path) {
        return collection.map(item => item[path]);
    };
};

module.exports = [{
    name: 'pluck',
    factory: factory,
}];
