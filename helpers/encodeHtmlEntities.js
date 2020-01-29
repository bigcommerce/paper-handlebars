'use strict';
const he = require('he');
const utils = require('handlebars-utils');
const common = require('./lib/common.js');
const SafeString = require('handlebars').SafeString;

const factory = () => {
    return function(string) {
        string = common.unwrapIfSafeString(string);
        if (!utils.isString(string)){
            throw new TypeError("Non-string passed to encodeHtmlEntities");
        }

        return new SafeString(he.encode(string));
    };
};

module.exports = [{
    name: 'encodeHtmlEntities',
    factory: factory,
}];
