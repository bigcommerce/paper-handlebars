'use strict';

const { getValue } = require('./lib/common');

/**
 * Based on https://github.com/helpers/handlebars-helpers/blob/0.9.0/lib/object.js#L128-L134
 * 
 * Get a value from the given context object. Property paths (`a.b.c`) may be used
 * to get nested properties.
 */
const factory = () => {
    return function (path, context) {
        let options = arguments[arguments.length - 1];

        // use an empty context if none was given
        if (arguments.length < 2) {
            context = {};
        }

        let value = getValue(context, path);
        if (options && options.fn) {
            return value ? options.fn(value) : options.inverse(context);
        }
        return value;
    };
};

module.exports = [{
    name: 'get',
    factory: factory,
}];