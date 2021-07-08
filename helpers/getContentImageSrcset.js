'use strict';
const { getObjectStorageImageSrcset } = require('./lib/getObjectStorageImage')

const factory = globals => {
    return function(path) {
        const siteSettings = globals.getSiteSettings();

        const cdnUrl = siteSettings.cdn_url || '';
        const contentFolderFingerprint = siteSettings.content_folder_fingerprint || '';

        return getObjectStorageImageSrcset(cdnUrl, 'content', path, contentFolderFingerprint);
    };
};

module.exports = [{
    name: 'getContentImageSrcset',
    factory: factory,
}];
