'use strict';

const getFonts = require('./lib/fonts');

const factory = globals => {
    return function() {
        return getFonts('linkElements', globals.getThemeSettings(), globals.handlebars);
    };
};

module.exports = [{
    name: 'getFontsCollection',
    factory: factory,
}];
