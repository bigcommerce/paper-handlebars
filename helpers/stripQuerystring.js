'use strict';
const utils = require('handlebars-utils');
const common = require('./lib/common.js');

const factory = globals => {
    return function(url) {
        url = common.unwrapIfSafeString(globals.handlebars, url);
        if (utils.isString(url)) {
            return url.split('?')[0];
        }
    };
};

module.exports = [{
    name: 'stripQuerystring',
    factory: factory,
}];
