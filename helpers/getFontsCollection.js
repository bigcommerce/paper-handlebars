'use strict';

const getFonts = require('./lib/fonts');

const factory = globals => {
    return function(...args) {
        const options = args.length ? args[args.length - 1] : null;
        const fontDisplay = options && options.hash['font-display'] ? options.hash['font-display'] : null;
        return getFonts('linkElements', globals.getThemeSettings(), globals.handlebars, {fontDisplay});
    };
};

module.exports = [{
    name: 'getFontsCollection',
    factory: factory,
}];
