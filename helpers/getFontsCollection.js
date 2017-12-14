'use strict';

var _ = require('lodash');

function helper(paper) {
    var handlebars = paper.handlebars;

    handlebars.registerHelper('getFontsCollection', function () {
        var fontKeyFormat = new RegExp(/\w+(-\w*)*-font$/),
            googleFonts = [],
            linkElements = [];

        _.each(paper.themeSettings, function (value, key) {
            var split;

            if (fontKeyFormat.test(key)) {
                split = value.split('_');

                switch (split[0]) {
                case 'Google':
                    googleFonts.push(value);
                    break;

                default:
                    break;
                }
            }
        });

        linkElements.push(googleParser(googleFonts));

        return new handlebars.SafeString(linkElements.join(''));
    });
}

/**
 * Parser for Google fonts
 *
 * @param fonts - Array of fonts that might look like
 * Google_Open+Sans
 * Google_Open+Sans_400
 * Google_Open+Sans_400_sans
 * Google_Open+Sans_400,700_sans
 * Google_Open+Sans_400,700italic
 * Google_Open+Sans_400,700italic_sans
 *
 * @returns {string}
 */

function googleParser(fonts) {
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

    return '<link href="//fonts.googleapis.com/css?family=' + collection.join('|') + '" rel="stylesheet">';
}

module.exports = helper;
