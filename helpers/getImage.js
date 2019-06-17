'use strict';
const common = require('./lib/common.js');

const factory = globals => {
    return function(image, presetName, defaultImageUrl) {
        const sizeRegex = /^(\d+?)x(\d+?)$/g;
        const settings = globals.getThemeSettings() || {};
        const presets = settings._images;
        let size, width, height;

        if (!common.isObject(image) || !common.isString(image.data) || image.data.indexOf('{:size}') === -1) {
            // return empty string if not a valid image object
            defaultImageUrl = defaultImageUrl ? defaultImageUrl : '';
            return common.isString(image) ? image : defaultImageUrl;
        }

        if (common.isObject(presets) && common.isObject(presets[presetName])) {
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