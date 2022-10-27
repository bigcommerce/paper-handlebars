'use strict';

const utils = require('./3p/utils');
const common = require('./lib/common.js');

const factory = globals => {
    return function(name) {
        name = common.unwrapIfSafeString(globals.handlebars, name);
        if (!utils.isString(name)) {
            globals.getLogger().info("Non-string passed to block helper");
            return '';
        }
        const options = arguments[arguments.length - 1];

        /* Look for partial by name. */
        const partial = globals.handlebars.partials[name] || options.fn;
        return partial(this, { data: options.hash });
    };
};

module.exports = [{
    name: 'block',
    factory: factory,
}];
