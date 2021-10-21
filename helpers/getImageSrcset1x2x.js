'use strict';
const utils = require('handlebars-utils');
const SafeString = require('handlebars').SafeString;
const common = require('./lib/common');

const factory = () => {
    return function(image, size1x) {
        // Regex to test size string is of the form 123x123
        const pixelDimensionsRegex = /(^\d+w$)|(^(\d+?)x(\d+?)$)/;

        if (!utils.isObject(image) || !utils.isString(image.data)
            || !common.isValidURL(image.data) || image.data.indexOf('{:size}') === -1) {
            throw new Error("Invalid StencilImage passed to getImageSrcset1x2x")
        }

        if (!pixelDimensionsRegex.test(size1x)) {
            throw new Error("Invalid size argument passed to getImageSrcset1x2x, must be a set of pixel dimensions of the format '123x123'")
        }

        if(!image.width || !image.height || !Number.isInteger(image.width) || !Number.isInteger(image.height)) {
            return new SafeString(image.data.replace('{:size}', size1x));
        }

        const [width1x, height1x] = size1x.split('x').map(i => parseInt(i));

        const [width2x, height2x] = [width1x, height1x].map(i => i * 2);

        if (width2x > image.width
            || height2x > image.height
            || width2x > common.maximumPixelSize
            || height2x > common.maximumPixelSize) {
            // Either the image is too small to make a srcset with a 2x size,
            // or those sizes would be larger than the resizer supports
            return new SafeString(image.data.replace('{:size}', size1x));
        } else {
            const size2x = `${width2x}x${height2x}`;
            return new SafeString(`${image.data.replace('{:size}', size1x)} 1x, ${image.data.replace('{:size}', size2x)} 2x`);
        }
    };
};

module.exports = [{
    name: 'getImageSrcset1x2x',
    factory: factory,
}];
