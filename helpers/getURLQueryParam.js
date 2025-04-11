'use strict';
const utils = require('./3p/utils');
const common = require('./lib/common.js');
const { ValidationError } = require('../lib/errors');

const factory = globals => {
    return function (string, key) {
        string = common.unwrapIfSafeString(globals.handlebars, string);
        key = common.unwrapIfSafeString(globals.handlebars, key);
        if (!utils.isString(string) || !common.isValidURL(string)) {
            throw new ValidationError("Invalid URL passed to setURLQueryParam");
        } else if (!utils.isString(key)) {
            throw new ValidationError("Invalid query parameter key passed to setURLQueryParam");
        }

        const url = new URL(string);

        return new globals.handlebars.SafeString(url.searchParams.get(encodeURIComponent(key)));
    };
};

module.exports = [{
    name: 'getURLQueryParam',
    factory: factory,
}];
