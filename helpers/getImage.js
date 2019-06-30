'use strict';

var _ = require('lodash');

const factory = globals => {
    return function(image, presetName, defaultImageUrl) {
        var sizeRegex = /^(\d+?)x(\d+?)$/g;
        var settings = globals.getThemeSettings() || {};
        var presets = settings._images;
        var size;
        var width;
        var height;

        if (!_.isPlainObject(image) || !_.isString(image.data) || image.data.indexOf('{:size}') === -1) {
            // return empty string if not a valid image object
            defaultImageUrl = defaultImageUrl ? defaultImageUrl : '';
            return _.isString(image) ? image : defaultImageUrl;
        }

        if (_.isPlainObject(presets) && _.isPlainObject(presets[presetName])) {
            // If preset is one of the given presets in _images
            width = parseInt(presets[presetName].width, 10) || 4096;
            height = parseInt(presets[presetName].height, 10) || 4096;
            size = width + 'x' + height;

        } else if (sizeRegex.test(settings[presetName])) {
            // If preset name is a setting and match the NNNxNNN format
            size = settings[presetName];
        } else {
            // Use the original image size
            size = 'original';
        }

        return image.data.replace('{:size}', size);

    };
};

module.exports = [{
    name: 'getImage',
    factory: factory,
}];
