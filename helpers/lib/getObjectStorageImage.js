'use strict';
const utils = require('../3p/utils');
const common = require('./common');

const { ValidationError } = require('../../lib/errors');

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

function getObjectStorageImage(handlebars, cdnUrl, source, path, options) {
    if (!utils.isString(path) || common.isValidURL(path)) {
        throw new ValidationError("Invalid image path - please use a filename or folder path starting from the appropriate folder");
    }

    // Return original image if there are no arguments
    let size = 'original';
    const lossy = options && options.hash && options.hash.lossy;

    if (Number.isInteger(options.hash['width'])) {
        if (Number.isInteger(options.hash['height'])) {
            // Return image of specified size
            size = `${options.hash['width']}x${options.hash['height']}`
        } else {
            // Return image of specified width
            size = `${options.hash['width']}w`
        }
    }

    const baseUrl = `${cdnUrl}/images/stencil/${size}/${source}/${path}`;
    const finalUrl = common.appendLossyParam(baseUrl, lossy);
    return new handlebars.SafeString(finalUrl);
}

function getObjectStorageImageSrcset(handlebars, cdnUrl, source, path, options) {
    if (!utils.isString(path) || common.isValidURL(path)) {
        throw new ValidationError("Invalid image path - please use a filename or folder path starting from the appropriate folder");
    }

    const lossy = options && options.hash && options.hash.lossy;

    return new handlebars.SafeString(Object.keys(srcsets).map(descriptor => {
        const baseUrl = `${cdnUrl}/images/stencil/${srcsets[descriptor]}/${source}/${path}`;
        const finalUrl = common.appendLossyParam(baseUrl, lossy);
        return ([`${finalUrl} ${descriptor}`].join(' '));
    }).join(', '));
}

module.exports = {
    getObjectStorageImage,
    getObjectStorageImageSrcset
};
