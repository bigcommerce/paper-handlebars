'use strict';

const factory = () => {
    return function(data) {
        return JSON.stringify(data);
    };
};

module.exports = [{
    name: 'json',
    factory: factory,
}];
