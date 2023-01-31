'use strict';

const factory = () => {
    return function(collection, path) {
        return collection.map(item => item.hasOwnProperty(path) ? item[path] : undefined);
    };
};

module.exports = [{
    name: 'pluck',
    factory: factory,
}];
