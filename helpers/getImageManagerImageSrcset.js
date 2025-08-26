'use strict';
const { getObjectStorageImageSrcset } = require('./lib/getObjectStorageImage')

const factory = globals => {
    return function(path) {
        const siteSettings = globals.getSiteSettings();

        const cdnUrl = siteSettings.cdn_url || '';
        const options = arguments[arguments.length - 1];

        return getObjectStorageImageSrcset(globals.handlebars, cdnUrl, 'image-manager', path, options);
    };
};

module.exports = [{
    name: 'getImageManagerImageSrcset',
    factory: factory,
}];
