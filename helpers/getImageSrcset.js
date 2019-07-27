'use strict';
const utils = require('handlebars-utils');
const SafeString = require('handlebars').SafeString;
const common = require('./lib/common');

const factory = () => {
    return function(image, defaultImageUrl) {
        // Regex to test size string is of the form 123x123 or 100w
        const sizeRegex = /(^\d+w$)|(^(\d+?)x(\d+?)$)/;
        // Regex to test to that srcset descriptor is of the form 1x 1.5x 2x OR 123w
        const descriptorRegex = /(^\d+w$)|(^([0-9](\.[0-9]+)?)x)$/;

        const options = arguments[arguments.length - 1];

        if (utils.isUndefined(defaultImageUrl)) {
            defaultImageUrl = '';
        }

        if (!utils.isObject(image) || !utils.isString (image.data)
            || !common.isValidURL(image.data) || image.data.indexOf('{:size}') === -1) {
            // return empty string if not a valid image object
            defaultImageUrl = defaultImageUrl ? defaultImageUrl : '';
            return utils.isString(image) ? image : defaultImageUrl;
        }

        let srcsets = {};

        if (options.hash['use_default_sizes']) {
            if (Number.isInteger(image.width) && Number.isInteger(image.height)){
                /* If we know the image dimensions, don't generate srcset sizes larger than the image  */
                srcsets[`${image.width}w`] = `${image.width}w`;
                const defaultSrcsetSizes = [2560, 1920, 1280, 960, 640, 320, 160, 80];
                defaultSrcsetSizes.forEach(width => {
                    if (width < image.width) {
                        srcsets[`${width}w`] = `${width}w`;
                    }
                });
            } else {
                /* If we DON'T know the image dimensions, generate a default set of srcsets
                *  This will upsize images */
                srcsets = {
                    '2560w': '2560w',
                    '1920w': '1920w',
                    '1280w': '1280w',
                    '960w': '960w',
                    '640w': '640w',
                    '320w': '320w',
                    '160w': '160w',
                    '80w': '80w',
                };
            }
        } else {
            srcsets = options.hash;
            if (!utils.isObject(srcsets) || Object.keys(srcsets).some(descriptor => {
                return !(descriptorRegex.test(descriptor) && sizeRegex.test(srcsets[descriptor]));
            })) {
                // return empty string if not valid srcset object
                return ''
            }
        }

        // If there's only one argument, return a `src` only (also works for `srcset`)
        if (Object.keys(srcsets).length === 1) {
            return new SafeString((image.data.replace('{:size}', srcsets[Object.keys(srcsets)[0]])));
        }

        return new SafeString(Object.keys(srcsets).reverse().map(descriptor => {
            return ([image.data.replace('{:size}', srcsets[descriptor]), descriptor].join(' '));
        }).join(', '));
    };
};

module.exports = [{
    name: 'getImageSrcset',
    factory: factory,
}];
