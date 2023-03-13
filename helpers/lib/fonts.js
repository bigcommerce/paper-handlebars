'use strict';

const URL = require('url')
const utils = require('../3p/utils');
const { ValidationError } = require('../../lib/errors');

const {resourceHintAllowedTypes, addResourceHint, defaultResourceHintState} = require('../lib/resourceHints');

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
        parser: function (fonts) {
            var collection = [],
                familyHash = {};

            Object.keys(fonts).forEach(function fontsIterator(key) {
                const font = fonts[key];
                var split = font.split('_'),
                    familyKey = split[1],  // Eg: Open+Sans
                    weights = split[2];    // Eg: 400,700italic

                if (utils.isEmpty(familyKey)) {
                    return;
                }

                if (utils.isUndefined(weights)) {
                    weights = '';
                }

                if (!utils.isArray(familyHash[familyKey])) {
                    familyHash[familyKey] = [];
                }

                weights = weights.split(',');

                familyHash[familyKey].push(weights);
                familyHash[familyKey] = [...new Set(familyHash[familyKey].flat())]
            });

            Object.keys(familyHash).forEach(function fontHashIterator(family) {
                const weights = familyHash[family];
                collection.push(family + ':' + weights.join(','));
            });

            return collection;
        },

        buildLink: function (fonts, fontDisplay) {
            const displayTypes = ['auto', 'block', 'swap', 'fallback', 'optional'];
            fontDisplay = displayTypes.includes(fontDisplay) ? fontDisplay : 'swap';
            const uri = `https://fonts.googleapis.com/css?family=${fonts.join('|')}&display=${fontDisplay}`
            try {
                const url = URL.parse(uri);
                return `<link href="${url.format()}" rel="stylesheet">`;
            } catch (error) {
                throw new ValidationError(`Invalid URL [${uri}]. Check configured fonts.`)
            }
        },

        buildFontLoaderConfig: function (fonts) {
            function replaceSpaces(font) {
                return font.split('+').join(' ');
            }

            return {
                google: {
                    families: fonts.map(font => replaceSpaces(font)),
                }
            };
        },

        generateResourceHints: function (globals, fonts, fontDisplay) {
            const displayTypes = ['auto', 'block', 'swap', 'fallback', 'optional'];
            fontDisplay = displayTypes.includes(fontDisplay) ? fontDisplay : 'swap';
            const path = `https://fonts.googleapis.com/css?family=${fonts.join('|')}&display=${fontDisplay}`;
            try {
                addResourceHint(
                    globals,
                    path,
                    defaultResourceHintState,
                    resourceHintAllowedTypes.resourceHintStyleType
                );
            } catch (e) {
                console.info(`EarlyHint generation failed while generating fonts collection.`, e);
            }
        }
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
module.exports = function (format, themeSettings, handlebars, options) {

    const collectedFonts = {};
    Object.keys(themeSettings).forEach(function (key) {
        //check that -font is on end of string but not start of string
        const fontKeySuffix = '-font';
        if (!key.endsWith(fontKeySuffix)) {
            return;
        }

        const splits = themeSettings[key].split('_');
        const provider = splits[0];

        if (typeof fontProviders[provider] === 'undefined') {
            return;
        }

        if (typeof collectedFonts[provider] === 'undefined') {
            collectedFonts[provider] = [];
        }

        collectedFonts[provider].push(themeSettings[key]);
    });

    // Parse font strings based on provider
    const parsedFonts = {};
    Object.keys(collectedFonts).forEach(function (key) {
        parsedFonts[key] = fontProviders[key].parser(collectedFonts[key]);
    });

    // Format output based on requested format
    switch (format) {
        case 'linkElements':
            const formattedFonts = {};
            Object.keys(parsedFonts).forEach(function (key) {
                fontProviders[key].generateResourceHints(options.globals, parsedFonts[key], options.fontDisplay);
                formattedFonts[key] = fontProviders[key].buildLink(parsedFonts[key], options.fontDisplay);
            });
            return new handlebars.SafeString(Object.values(formattedFonts).join(''));

        case 'webFontLoaderConfig':
            // Build configs
            const configs = {};
            Object.keys(parsedFonts).forEach(function (key) {
                configs[key] = fontProviders[key].buildFontLoaderConfig(parsedFonts[key]);
            });

            // Merge them
            const fontLoaderConfig = {};
            Object.values(configs).forEach((config) => {
                Object.assign(fontLoaderConfig, config);
            });
            return fontLoaderConfig;

        case 'providerLists':
        default:
            return parsedFonts;
    }
}
