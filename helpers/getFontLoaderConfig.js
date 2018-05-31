'use strict';

const getFonts = require('./lib/fonts');

const factory = globals => {
    return function() {
        const fontConfig = getFonts('webFontLoaderConfig', globals.getThemeSettings(), globals.handlebars);
        return new globals.handlebars.SafeString(JSON.stringify(fontConfig));
    };
};

module.exports = [{
    name: 'getFontLoaderConfig',
    factory: factory,
}];
