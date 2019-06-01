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
            const collection = [];
            const familyHash = {};

            for (let i = 0; i < fonts.length; i++) {
                const split = fonts[i].split('_');
                const familyKey = split[1];
                let weights = split[2];

                if (!familyKey || !familyKey.length) {
                   continue;
                }
                if (typeof weights === 'undefined') {
                    weights = '';
                }
                if (!Array.isArray(familyHash[familyKey])) {
                    familyHash[familyKey] = [];
                }
                weights = weights.split(',');
                familyHash[familyKey].push(...weights);
            }

            const familyHashKeys = Object.keys(familyHash);

            for (let i = 0; i < familyHashKeys.length; i++) {
                const family = familyHashKeys[i];
                const weights = familyHash[family];
                const uniqueWeights = Array.from(new Set(weights));
                collection.push(`${family}:${uniqueWeights.join(',')}`);
            }

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
            function familyBuilder(fonts) {
                const fontsCopy = fonts.slice();
                for (let i = 0; i < fontsCopy.length; i++) {
                    fontsCopy[i] = replaceSpaces(fontsCopy[i]);
                }
                return fontsCopy;
            }
            return {
                google: {
                    families: familyBuilder(fonts),
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
    const themeSettingsKeys = Object.keys(themeSettings);

    for (let i = 0; i < themeSettingsKeys.length; i++) {
        const key = themeSettingsKeys[i];
        const value = themeSettings[key];
        //check that -font is on end of string but not start of string
        const fontKeySuffix = '-font';
        if (!key.endsWith(fontKeySuffix)) {
            continue;
        }

        const splits = value.split('_');
        const provider = splits[0];

        if (typeof fontProviders[provider] === 'undefined') {
            continue;
        }

        if (typeof collectedFonts[provider] === 'undefined') {
            collectedFonts[provider] = [];
        }

        collectedFonts[provider].push(value);
    }

    // Parse font strings based on provider
    const parsedFonts = {};
    const collectedFontsKeys = Object.keys(collectedFonts);

    for (let i = 0; i < collectedFontsKeys.length; i++) {
        const font = collectedFontsKeys[i];
        parsedFonts[font] = fontProviders[font].parser(collectedFonts[font]);
    }
    const parsedFontsKeys = Object.keys(parsedFonts);
    // Format output based on requested format
    switch(format) {
    case 'linkElements':
        const formattedFonts = {};

        for (let i = 0; i < parsedFontsKeys.length; i++) {
            const font = parsedFontsKeys[i];
            formattedFonts[font] = fontProviders[font].buildLink(parsedFonts[font], options.fontDisplay);
        }
        const formattedFontsOutput = [];
        const formattedFontsKeys = Object.keys(formattedFonts);
        
        for (let i = 0; i < formattedFontsKeys.length; i++) {
            formattedFontsOutput.push(formattedFonts[formattedFontsKeys[i]]);
        }
        return new handlebars.SafeString(formattedFontsOutput.join(''));

    case 'webFontLoaderConfig':
        // Build configs
        const configs = {};

        for (let i = 0; i < parsedFontsKeys.length; i++) {
            const font = parsedFontsKeys[i];
            configs[font] = fontProviders[font].buildFontLoaderConfig(parsedFonts[font]);
        }

        // Merge them
        const fontLoaderConfig = {};
        const configValues = Object.values(configs);

        for (let i = 0; i < configValues.length; i++) {
            Object.assign(fontLoaderConfig, configValues[i]);
        }

        return fontLoaderConfig;

    case 'providerLists':
    default:
        return parsedFonts;
    }
}
