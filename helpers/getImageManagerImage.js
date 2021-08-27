'use strict';
const { getObjectStorageImage } = require('./lib/getObjectStorageImage')

const factory = globals => {
    return function(path) {
        const siteSettings = globals.getSiteSettings();

        const cdnUrl = siteSettings.cdn_url || '';
        const imageManagerFingerprint = siteSettings.image_manager_fingerprint || '';

        const options = arguments[arguments.length - 1];

        return getObjectStorageImage(cdnUrl, 'image-manager', path, options, imageManagerFingerprint);
    };
};

module.exports = [{
    name: 'getImageManagerImage',
    factory: factory,
}];
