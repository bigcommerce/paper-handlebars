'use strict';

const { getValue } = require('./lib/common');

/*
 * Based on https://github.com/helpers/handlebars-helpers/blob/0.9.0/lib/object.js#L149-L151
 * and https://github.com/jonschlinkert/get-object/blob/0.2.0/index.js#L12-L24
 * 
 * Get an object or array containing a value from the given context object.
 * Property paths (`a.b.c`) may be used to get nested properties.
 */
const factory = (globals) => {
    return function (path, context) {
        // use an empty context if none was given
        // (expect 3 args: `path`, `context`, and the `options` object 
        // Handlebars always passes as the last argument to a helper)
        if (arguments.length < 3) {
            context = {};
        }

        if (!path) {
            // return entire context object if no property/path specified
            return context;
        }

        path = String(path);

        const parts = path.split(/[[.\]]/).filter(Boolean);

        let value = getValue(globals, context, parts);

        // for backwards compatibility: `get-object` returns on empty object instead of
        // getting props with 'false' values (not just undefined)
        if (!value) {
            return {};
        }

        // return an array if the final path part is numeric to mimic behavior of `get-object`
        const last = parts[parts.length - 1];
        if (Number.isFinite(Number(last))) {
            return [ value ];
        }
        let result = {};
        result[last] = value
        return result;
    };
};

module.exports = [{
    name: 'getObject',
    factory: factory,
}];