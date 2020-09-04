'use strict';

const getFonts = require('./lib/fonts');

const fontResources = {
    'Google': [
        'https://fonts.googleapis.com',
        'https://fonts.gstatic.com',
    ],
};

function format(host) {
    return `<link rel="dns-prefetch preconnect" href="${host}" crossorigin>`;
}

const factory = globals => {
    return function() {
        var hosts = [];

        // Add cdn
        const cdnUrl = globals.getSiteSettings()['cdn_url'];
        if (cdnUrl) {
            hosts.push(cdnUrl);
        }

        const fonts = getFonts(
            'providerLists',
            globals.getThemeSettings(),
            globals.handlebars
        );

        Object.keys(fonts).forEach((provider) => {
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
