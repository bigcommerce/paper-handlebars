'use strict';
const utils = require('handlebars-utils');
const common = require('./lib/common.js');

const factory = () => {
    return function(url) {
        url = common.unwrapIfSafeString(url);
        if (utils.isString(url)) {
            return url.split('?')[0];
        }
    };
};

module.exports = [{
    name: 'stripQuerystring',
    factory: factory,
}];
