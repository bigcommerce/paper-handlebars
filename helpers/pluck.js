'use strict';

const common = require('./lib/common.js');

const factory = () => {
    return function(collection, path) {
        const arr = [];

        if (Array.isArray(collection)) {
            for (let i = 0; i < collection.length; i++) {
                arr.push(collection[i][path]);
            } 
        } else if (common.isObject(collection)) {
            const collectionKeys = Object.keys(collection);
            for (let i = 0; i < collectionKeys.length; i++) {
                arr.push(collection[collectionKeys[i]][path]);
            }
        }
        return arr;
    }
};

module.exports = [{
    name: 'pluck',
    factory: factory,
}];
