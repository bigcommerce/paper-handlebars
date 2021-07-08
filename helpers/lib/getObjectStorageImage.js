'use strict';
const utils = require('handlebars-utils');
const common = require('./common');
const SafeString = require('handlebars').SafeString;
const URL = require('url').URL;

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

function generateUrl(cdnUrl, size, source, path, fingerprint) {
    // Build sized image URL, appending fingerprint if known
    let assetUrl = new URL(`${cdnUrl}/images/stencil/${size}/${source}/${path}`)
    if (fingerprint) {
        assetUrl.searchParams.set('t', contentFolderFingerprint);
    }
    return assetUrl.toString()
}

function getObjectStorageImage(cdnUrl, source, path, options, fingerprint) {
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

    return new SafeString(generateUrl(cdnUrl, size, source, path, fingerprint));
}

function getObjectStorageImageSrcset(cdnUrl, source, path, fingerprint) {
    if (!utils.isString (path) || common.isValidURL(path)) {
        throw new TypeError("Invalid image path - please use a filename or folder path starting from the appropriate folder");
    }

    return new SafeString(Object.keys(srcsets).map(descriptor => {
        return ([`${generateUrl(cdnUrl, srcsets[descriptor], source, path, fingerprint)} ${descriptor}`].join(' '));
    }).join(', '));
}

module.exports = {
    getObjectStorageImage,
    getObjectStorageImageSrcset
};
