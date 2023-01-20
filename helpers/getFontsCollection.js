'use strict';

const getFonts = require('./lib/fonts');

const factory = globals => {
    return function () {
        const options = arguments[arguments.length - 1];
        const fontDisplay = options.hash['font-display'];
        const getFontsOptions = {globals, fontDisplay};
        return getFonts('linkElements', globals.getThemeSettings(), globals.handlebars, getFontsOptions);
    };
};

module.exports = [{
    name: 'getFontsCollection',
    factory: factory,
}];
