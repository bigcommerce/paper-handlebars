'use strict';
const { getObjectStorageImageSrcset } = require('./lib/getObjectStorageImage')

const factory = globals => {
    return function(path) {
        const siteSettings = globals.getSiteSettings();

        const cdnUrl = siteSettings.cdn_url || '';
        const imageManagerFingerprint = siteSettings.image_manager_fingerprint || '';

        return getObjectStorageImageSrcset(cdnUrl, 'image-manager', path, imageManagerFingerprint);
    };
};

module.exports = [{
    name: 'getImageManagerImageSrcset',
    factory: factory,
}];
