'use strict';
const SafeString = require('handlebars').SafeString;
const utils = require('handlebars-utils');

const factory = () => {
    return function(url) {
        if (url instanceof SafeString) {
            url = url.toString();
        }
        if (utils.isString(url)) {
            return url.split('?')[0];
        }
    };
};

module.exports = [{
    name: 'stripQuerystring',
    factory: factory,
}];
