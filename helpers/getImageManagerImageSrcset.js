'use strict';
const { getObjectStorageImageSrcset } = require('./lib/getObjectStorageImage')

const factory = globals => {
    return function(path) {
        const siteSettings = globals.getSiteSettings();

        const cdnUrl = siteSettings.cdn_url || '';

        return getObjectStorageImageSrcset(cdnUrl, 'image-manager', path);
    };
};

module.exports = [{
    name: 'getImageManagerImageSrcset',
    factory: factory,
}];
