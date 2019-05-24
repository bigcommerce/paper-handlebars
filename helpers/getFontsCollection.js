'use strict';

const getFonts = require('./lib/fonts');

const factory = globals => {
    return function() {
        const options = arguments.length === 1 ? arguments[arguments.length - 1] : null;
        const fontDisplay = options && options.hash['font-display'] ? options.hash['font-display'] : null;
        return getFonts('linkElements', globals.getThemeSettings(), globals.handlebars, {fontDisplay});
    };
};

module.exports = [{
    name: 'getFontsCollection',
    factory: factory,
}];
