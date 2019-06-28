'use strict';
const URL = require('url').URL;
const utils = require('handlebars-utils');
const common = require('./lib/common.js');

const factory = () => {
    return function(image, options) {
        if (!utils.isObject(image) || !utils.isString(image.data) || !common.isValidURL(image.data)) {
            // Return empty string if this does not appear to be an image object.
            return ''
        }

        // 'https://cdn0.bigcommerce.com/s-hash/images/stencil/{:size}/l/some-image.original.jpg?c=2'
        let url = new URL(image.data);
        
        //remove AIM query strings if already set by the application
        url.searchParams.delete('imbypass');
        url.searchParams.delete('imdevicesize');
        url.searchParams.delete('imdeviceformat');

        if (options && utils.isOptions((options))) {
            if (options.hash['disable-all-optimizations']) {
                // Add parameter to disable Akamai Image Manager optimization.
                url.searchParams.set('imbypass', '1');
                // Query string is now: 'c=2&imbypass=on'
            } else {
                if (options.hash['disable-device-sizing']) {
                    url.searchParams.set('imdevicesize', '0');
                }
                if (options.hash['disable-device-formatting']) {
                    url.searchParams.set('imdeviceformat', '0');
                }
            }
        }
        // Put special '{:size}' string back (it was URL encoded)
        image.data = url.toString().replace('%7B:size%7D', '{:size}');

        return image;
    };
};

module.exports = [{
    name: 'configureImage',
    factory: factory,
}];
