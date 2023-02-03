'use strict';

const factory = () => {
    return function(collection, path) {
        if (collection) {
            return collection.map(item => item.hasOwnProperty(path) ? item[path] : undefined);
        }
        return [];
    };
};

module.exports = [{
    name: 'pluck',
    factory: factory,
}];
