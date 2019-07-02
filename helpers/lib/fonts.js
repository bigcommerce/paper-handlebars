'use strict';

const _ = require('lodash');

const fontProviders = {
    'Google': {
        /**
         * Parser for Google fonts
         *
         * @param {Array} fonts - Array of fonts that might look like
         * Google_Open+Sans
         * Google_Open+Sans_400
         * Google_Open+Sans_400_sans
         * Google_Open+Sans_400,700_sans
         * Google_Open+Sans_400,700italic
         * Google_Open+Sans_400,700italic_sans
         *
         * @returns {string}
         */
        parser: function(fonts) {
            var collection = [],
                familyHash = {};

            _.each(fonts, function fontsIterator(font) {
                var split = font.split('_'),
                    familyKey = split[1],  // Eg: Open+Sans
                    weights = split[2];    // Eg: 400,700italic

                if (_.isEmpty(familyKey)) {
                    return;
                }

                if (_.isUndefined(weights)) {
                    weights = '';
                }

                if (!_.isArray(familyHash[familyKey])) {
                    familyHash[familyKey] = [];
                }

                weights = weights.split(',');

                familyHash[familyKey].push(weights);
                familyHash[familyKey] = _.uniq(_.flatten(familyHash[familyKey]));
            });

            _.each(familyHash, function fontHashIterator(weights, family) {
                collection.push(family + ':' + weights.join(','));
            });

            return collection;
        },

        buildLink: function(fonts, fontDisplay) {
            const displayTypes = ['auto', 'block', 'swap', 'fallback', 'optional'];
            fontDisplay = displayTypes.includes(fontDisplay) ? fontDisplay : 'swap';
            return `<link href="https://fonts.googleapis.com/css?family=${fonts.join('|')}&display=${fontDisplay}" rel="stylesheet">`;
        },

        buildFontLoaderConfig: function(fonts) {
            function replaceSpaces(font) {
                return font.split('+').join(' ');
            }

            return {
                google: {
                    families: fonts.map(font => replaceSpaces(font)),
                }
            };
        },
    },
};

/**
 * Get collection of fonts used in theme settings.
 *
 * @param {string} format The desired return value. If format == 'providerLists', return an object with provider names for keys
 *   and a list of fonts in the provider format as values, suitable for use with Web Font Loader. If format == 'linkElements',
 *   return a string containing <link> elements to be directly inserted into the page. If format == 'webFontLoaderConfig', return an
 *   object that can be used to configure Web Font Loader.
 * @param {Object} themeSettings Object containing theme settings.
 * @param {Object} handlebars The handlebars instance.
 * @param {Object} options an optional object for additional configuration details
 * @returns {Object.<string, Array>|string}
 */
module.exports = function(format, themeSettings, handlebars, options) {
    
    const collectedFonts = {};
    _.each(themeSettings, function(value, key) {
        //check that -font is on end of string but not start of string
        const fontKeySuffix = '-font';
        if (!key.endsWith(fontKeySuffix)) {
            return;
        }

        const splits = value.split('_');
        const provider = splits[0];

        if (typeof fontProviders[provider] === 'undefined') {
            return;
        }

        if (typeof collectedFonts[provider] === 'undefined') {
            collectedFonts[provider] = [];
        }

        collectedFonts[provider].push(value);
    });

    // Parse font strings based on provider
    const parsedFonts = _.mapValues(collectedFonts, function(value, key) {
        return fontProviders[key].parser(value);
    });

    // Format output based on requested format
    switch(format) {
    case 'linkElements':
        
        const formattedFonts = _.mapValues(parsedFonts, function(value, key) {
            return fontProviders[key].buildLink(value, options.fontDisplay);
        });
        return new handlebars.SafeString(_.values(formattedFonts).join(''));

    case 'webFontLoaderConfig':
        // Build configs
        const configs = _.mapValues(parsedFonts, function(value, key) {
            return fontProviders[key].buildFontLoaderConfig(value);
        });

        // Merge them
        const fontLoaderConfig = {};
        _.each(configs, function(config) {
            return Object.assign(fontLoaderConfig, config);
        });
        return fontLoaderConfig;

    case 'providerLists':
    default:
        return parsedFonts;
    }
}
