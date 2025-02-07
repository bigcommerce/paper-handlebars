'use strict';
const common = require('./lib/common.js');

const factory = globals => {
    return function(data) {
        data = common.unwrapIfSafeString(globals.handlebars, data);
        return typeof data;
    };
};

module.exports = [{
    name: 'typeof',
    factory: factory,
}];
