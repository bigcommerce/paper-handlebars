'use strict';
const he = require('he');
const utils = require('handlebars-utils');
const common = require('./lib/common.js');
const SafeString = require('handlebars').SafeString;

const factory = () => {
    return function(string) {
        string = common.unwrapIfSafeString(string);
        if (!utils.isString(string)){
            throw new TypeError("Non-string passed to decodeHtmlEntities");
        }

        const options = arguments[arguments.length - 1];

        let args = {};

        if (utils.isOptions(options)) {
            args = options.hash;

            // Whitelist of allowed named arguments into `he` function
            const allowedArguments = [
                'isAttributeValue',
                'strict',
            ];

            // Make sure all named arguments from options hash are in the whitelist and have boolean (string) values
            if (Object.keys(args).some(key => !allowedArguments.includes(key))
                || !Object.keys(args).map(key => args[key]).every(val => ['true', 'false'].includes(val))) {
                throw new TypeError("Invalid named argument passed to decodeHtmlEntities");
            }
        }

        return new SafeString(he.decode(string, args));
    };
};

module.exports = [{
    name: 'decodeHtmlEntities',
    factory: factory,
}];
