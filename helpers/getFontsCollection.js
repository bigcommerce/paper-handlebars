'use strict';

const getFonts = require('./lib/fonts');
const utils = require('handlebars-utils');

const factory = globals => {
    return function() {
        const options = arguments[arguments.length - 1];
        const fontDisplay = options.hash['font-display'];

        const getFontsOptions = utils.isString(options.hash.resourceHint) ? {
            globals,
            state: options.hash.resourceHint,
            fontDisplay
        } : {fontDisplay};

        return getFonts('linkElements', globals.getThemeSettings(), globals.handlebars, getFontsOptions);
    };
};

module.exports = [{
    name: 'getFontsCollection',
    factory: factory,
}];
