'use strict';

const factory = () => {
    return function(collection, path) {
        if (collection && Array.isArray(collection)) {
            return collection.map(item => Object.hasOwnProperty.call(item, path) ? item[path] : undefined);
        }
        return [];
    };
};

module.exports = [{
    name: 'pluck',
    factory: factory,
}];
