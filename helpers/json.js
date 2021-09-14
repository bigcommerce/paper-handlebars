'use strict';
const common = require('./lib/common.js');

const factory = globals => {
    return function(data) {
        data = common.unwrapIfSafeString(globals.handlebars, data);
        return JSON.stringify(data);
    };
};

module.exports = [{
    name: 'json',
    factory: factory,
}];
