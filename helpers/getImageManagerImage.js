'use strict';
const utils = require('handlebars-utils');
const common = require('./lib/common');
const SafeString = require('handlebars').SafeString;

const factory = globals => {
    return function(path) {
        const siteSettings = globals.getSiteSettings();

        const cdnUrl = siteSettings.cdn_url || '';

        const options = arguments[arguments.length - 1];

        if (!utils.isString (path) || common.isValidURL(path)) {
            throw new TypeError("Invalid path for getImageManagerImage helper");
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

        return new SafeString(`${cdnUrl}/images/stencil/${size}/image-manager/${path}`);
    };
};

module.exports = [{
    name: 'getImageManagerImage',
    factory: factory,
}];
