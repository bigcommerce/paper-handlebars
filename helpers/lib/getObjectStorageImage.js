'use strict';
const utils = require('handlebars-utils');
const common = require('./common');
const SafeString = require('handlebars').SafeString;

const srcsets = {
    '80w': '80w',
    '160w': '160w',
    '320w': '320w',
    '640w': '640w',
    '960w': '960w',
    '1280w': '1280w',
    '1920w': '1920w',
    '2560w': '2560w',
};

function getObjectStorageImage(cdnUrl, source, path, options) {
    if (!utils.isString (path) || common.isValidURL(path)) {
        throw new TypeError("Invalid image path - please use a filename or folder path starting from the appropriate folder");
    }

    // Return original image if there are no arguments
    let size = 'original';

    if (Number.isInteger(options.hash['width'])) {
        if (Number.isInteger(options.hash['height'])) {
            // Return image of specified size
            size = `${options.hash['width']}x${options.hash['height']}`
        } else {
            // Return image of specified width
            size = `${options.hash['width']}w`
        }
    }

    return new SafeString(`${cdnUrl}/images/stencil/${size}/${source}/${path}`);
}

function getObjectStorageImageSrcset(cdnUrl, source, path) {
    if (!utils.isString (path) || common.isValidURL(path)) {
        throw new TypeError("Invalid image path - please use a filename or folder path starting from the appropriate folder");
    }

    return new SafeString(Object.keys(srcsets).map(descriptor => {
        return ([`${cdnUrl}/images/stencil/${srcsets[descriptor]}/${source}/${path} ${descriptor}`].join(' '));
    }).join(', '));
}

module.exports = {
    getObjectStorageImage,
    getObjectStorageImageSrcset
};
