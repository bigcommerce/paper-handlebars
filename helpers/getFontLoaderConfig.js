'use strict';

const getFonts = require('./lib/fonts');

const factory = globals => {
    return function() {
        const options = arguments[arguments.length - 1];

        // Default is "false"
        const classes = !!options.hash['classes'];

        const fontConfig = getFonts('webFontLoaderConfig', globals.getThemeSettings(),
            globals.handlebars, {classes});

        return new globals.handlebars.SafeString(JSON.stringify(fontConfig));
    };
};

module.exports = [{
    name: 'getFontLoaderConfig',
    factory: factory,
}];
