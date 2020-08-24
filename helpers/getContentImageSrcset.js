'use strict';
const utils = require('handlebars-utils');
const common = require('./lib/common');
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

const factory = globals => {
    return function(path) {
        const siteSettings = globals.getSiteSettings();

        const cdnUrl = siteSettings.cdn_url || '';

        if (!utils.isString (path) || common.isValidURL(path)) {
            throw new TypeError("Invalid path for getContentImageSrcset helper");
        }

        return new SafeString(Object.keys(srcsets).map(descriptor => {
            return ([`${cdnUrl}/images/stencil/${srcsets[descriptor]}/content/${path} ${descriptor}`].join(' '));
        }).join(', '));
    };
};

module.exports = [{
    name: 'getContentImageSrcset',
    factory: factory,
}];
