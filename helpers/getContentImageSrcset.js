'use strict';
const { getObjectStorageImageSrcset } = require('./lib/getObjectStorageImage')

const factory = globals => {
    return function(path) {
        const siteSettings = globals.getSiteSettings();

        const cdnUrl = siteSettings.cdn_url || '';

        return getObjectStorageImageSrcset(cdnUrl, 'content', path);
    };
};

module.exports = [{
    name: 'getContentImageSrcset',
    factory: factory,
}];
