'use strict';
const utils = require('./3p/utils');
const common = require('./lib/common.js');
const { ValidationError } = require('../lib/errors');

const factory = globals => {
    return function (string, key, value) {
        string = common.unwrapIfSafeString(globals.handlebars, string);
        key = common.unwrapIfSafeString(globals.handlebars, key);
        value = common.unwrapIfSafeString(globals.handlebars, value);
        if (!utils.isString(string) || !common.isValidURL(string)) {
            throw new ValidationError("Invalid URL passed to setURLQueryParam");
        } else if (!utils.isString(key)) {
            throw new ValidationError("Invalid query parameter key passed to setURLQueryParam");
        } else if (!utils.isString(value)) {
            throw new ValidationError("Invalid query parameter value passed to setURLQueryParam");
        }

        const url = new URL(string);

        url.searchParams.set(encodeURIComponent(key), encodeURIComponent(value));

        return new globals.handlebars.SafeString(url.toString());
    };
};

module.exports = [{
    name: 'setURLQueryParam',
    factory: factory,
}];
