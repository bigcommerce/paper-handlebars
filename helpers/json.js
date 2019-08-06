'use strict';
const common = require('./lib/common.js');

const factory = () => {
    return function(data) {
        data = common.unwrapIfSafeString(data);
        return JSON.stringify(data);
    };
};

module.exports = [{
    name: 'json',
    factory: factory,
}];
