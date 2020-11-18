'use strict';

const _ = require('lodash');
const getFonts = require('./lib/fonts');

const fontResources = {
    'Google': [
        'https://fonts.googleapis.com',
        'https://fonts.gstatic.com',
    ],
};

const factory = globals => {
    return function() {
        function format(host) {
            return `<link rel="dns-prefetch preconnect" href="${host}" crossorigin>`;
        }

        var hosts = [];

        // Add cdn
        const siteSettings = globals.getSiteSettings();
        const cdnUrl = siteSettings['cdn_url'] || '';
        if (cdnUrl != '') {
            hosts.push(cdnUrl);
        }

        // Add font providers
        const fontProviders = _.keys(getFonts('providerLists', globals.getThemeSettings(), globals.handlebars));
        _.each(fontProviders, function(provider) {
            if (typeof fontResources[provider] !== 'undefined') {
                hosts = hosts.concat(fontResources[provider]);
            }
        });

        return new globals.handlebars.SafeString(hosts.map(host => format(host)).join(''));
    };
};

module.exports = [{
    name: 'resourceHints',
    factory: factory,
}];
