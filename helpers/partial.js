'use strict';

const utils = require('./3p/utils');
const common = require('./lib/common.js');

const factory = globals => {
    return function(name) {
        name = common.unwrapIfSafeString(globals.handlebars, name);
        if (!utils.isString(name)) {
            globals.getLogger().info("Non-string passed to partial helper");
            return '';
        }
        const options = arguments[arguments.length - 1];
        globals.handlebars.registerPartial(name, options.fn);
    };
};

module.exports = [{
    name: 'partial',
    factory: factory,
}];
