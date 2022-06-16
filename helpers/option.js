'use strict';

const util = require('handlebars-utils');
const { getValue } = require('./lib/common');

/**
 * Based on https://github.com/helpers/handlebars-helpers/blob/0.9.0/lib/misc.js#L26-L28
 * 
 * Get a value from the options object. Property paths (`a.b.c`) may be used
 * to get nested properties.
 */
const factory = () => {
    return function (path, locals) {
        // preserve `option` behavior with missing args while ensuring the correct
        // options object is used
        let options = arguments[arguments.length - 1];
        if (arguments.length < 3) {
            locals = null;
        }
        if (arguments.length < 2) {
            path = '';
        }

        let opts = util.options(this, locals, options);

        return getValue(opts, path);
    };
};

module.exports = [{
    name: "option",
    factory: factory,
}]