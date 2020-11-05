'use strict';

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

            fonts.forEach(font => {
                var split = font.split('_'),
                    familyKey = split[1],  // Eg: Open+Sans
                    weights = split[2];    // Eg: 400,700italic

                if (!familyKey) {
                    return;
                }

                if (typeof weights === 'undefined') {
                    weights = '';
                }

                if (!Array.isArray(familyHash[familyKey])) {
                    familyHash[familyKey] = [];
                }

                weights = weights.split(',');

                familyHash[familyKey].push(weights);
                familyHash[familyKey] = Array.from(new Set([].concat.apply([], familyHash[familyKey])));
            });

            Object.entries(familyHash).forEach(([family, weights]) => {
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
    const collectedFonts = Object.entries(themeSettings)
        .reduce(
            (
                collectedFonts,
                [key, value]
            ) => {
                //check that -font is on end of string but not start of string
                const fontKeySuffix = '-font';
                if (!key.endsWith(fontKeySuffix)) {
                    return collectedFonts;
                }

                const splits = value.split('_');
                const provider = splits[0];

                if (typeof fontProviders[provider] === 'undefined') {
                    return collectedFonts;
                }

                if (typeof collectedFonts[provider] === 'undefined') {
                    collectedFonts[provider] = [];
                }

                collectedFonts[provider].push(value);

                return collectedFonts;
            },
            {}
        );

    // Parse font strings based on provider
    const parsedFonts = Object.entries(collectedFonts).reduce(
        (
            parsedFonts,
            [key, value]
        ) => {
            parsedFonts[key] = fontProviders[key].parser(value);

            return parsedFonts;
        },
        {}
    );

    // Format output based on requested format
    switch(format) {
    case 'linkElements':
        const formattedFonts = Object.entries(parsedFonts).reduce(
            (
                formattedFonts,
                [key, value]
            ) => {
                formattedFonts[key] = fontProviders[key].buildLink(value, options.fontDisplay);

                return formattedFonts;
            },
            {}
        );

        return new handlebars.SafeString(Object.entries(formattedFonts).map(([key, value]) => value).join(''));

    case 'webFontLoaderConfig':
        // Build configs
        return Object.assign(Object.entries(parsedFonts).reduce(
            (
                configs,
                [key, value]
            ) => {
                configs[key] = fontProviders[key].buildFontLoaderConfig(value);

                return Object.entries(configs).reduce(
                    (
                        fontLoaderConfig,
                        [key, config]
                    ) => {
                        return Object.assign(fontLoaderConfig, config);
                    },
                    {}
                );
            },
            {}
        ), {classes: options.classes});

    case 'providerLists':
    default:
        return parsedFonts;
    }
};
