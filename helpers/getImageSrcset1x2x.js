'use strict';
const utils = require('./3p/utils');
const common = require('./lib/common');
const { ValidationError } = require('../lib/errors');

const factory = globals => {
    return function (image, size1x) {
        // Regex to test size string is of the form 123x123
        const pixelDimensionsRegex = /(^\d+w$)|(^(\d+?)x(\d+?)$)/;
        const options = arguments[arguments.length - 1];
        const lossy = options && options.hash && options.hash.lossy;
        
        const return1x = (image, size1x) => {
            const processedUrl = image.data.replace('{:size}', size1x);
            const finalUrl = common.appendLossyParam(processedUrl, lossy);
            return new globals.handlebars.SafeString(finalUrl);
        };

        if (!utils.isObject(image) || !utils.isString(image.data)
            || !common.isValidURL(image.data) || image.data.indexOf('{:size}') === -1) {
            throw new ValidationError("Invalid StencilImage passed to getImageSrcset1x2x")
        }

        if (!pixelDimensionsRegex.test(size1x)) {
            throw new ValidationError("Invalid size argument passed to getImageSrcset1x2x, must be a set of pixel dimensions of the format '123x123'")
        }

        if (!image.width || !image.height || !Number.isInteger(image.width) || !Number.isInteger(image.height)) {
            return return1x(image, size1x);
        }

        const [width1x, height1x] = size1x.split('x').map(i => parseInt(i));

        if (width1x > image.width
            || width1x > image.height) {
            // Either the image is too small to make a srcset with a 2x size,
            // or those sizes would be larger than the resizer supports
            return return1x(image, size1x);
        } else {
            const smallestFactor = Math.min((image.width / width1x), (image.height / height1x));
            const factor = smallestFactor < 2 ? smallestFactor : 2;
            const roundedFactor = +(factor).toFixed(4) //cast to Number for clean rounding

            const [widthXx, heightXx] = [width1x, height1x].map(i => Math.round(i * factor));

            if (widthXx > common.maximumPixelSize || heightXx > common.maximumPixelSize) {
                return return1x(image, size1x);
            }

            const sizeXx = `${widthXx}x${heightXx}`;
            
            const url1x = common.appendLossyParam(image.data.replace('{:size}', size1x), lossy);
            const urlXx = common.appendLossyParam(image.data.replace('{:size}', sizeXx), lossy);

            return new globals.handlebars.SafeString(`${url1x} 1x, ${urlXx} ${roundedFactor}x`);
        }
    };
};

module.exports = [{
    name: 'getImageSrcset1x2x',
    factory: factory,
}];
