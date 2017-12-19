'use strict';

const factory = globals => {
    return function(data) {
        return JSON.stringify(data);
    };
};

module.exports = [{
    name: 'json',
    factory: factory,
}];
