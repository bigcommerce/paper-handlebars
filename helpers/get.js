'use strict';

const { getValue } = require('./lib/common');

/**
 * Based on https://github.com/helpers/handlebars-helpers/blob/0.9.0/lib/object.js#L128-L134
 * 
 * Get a value from the given context object. Property paths (`a.b.c`) may be used
 * to get nested properties.
 */
const factory = (globals) => {
    return function (path, context) {
        let options = arguments[arguments.length - 1];

        // for backwards compatibility
        if (context === null || (typeof context !== 'object' && typeof context !== 'function')) {
            return context;
        }

        // use an empty context if none was given
        if (!context) {
            context = {};
        }

        // for backwards compatibility: safely use options hash as context if no context was passed
        if (arguments.length < 3) {
            context = { hash: options.hash };
        }

        let value = getValue(context, path, globals);
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