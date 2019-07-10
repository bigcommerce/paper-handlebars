'use strict';

const getFonts = require('./lib/fonts');

const factory = globals => {
    return function() {
        const options = arguments[arguments.length - 1];
        const fontDisplay = options.hash['font-display'];
        return getFonts('linkElements', globals.getThemeSettings(), globals.handlebars, {fontDisplay});
    };
};

module.exports = [{
    name: 'getFontsCollection',
    factory: factory,
}];
