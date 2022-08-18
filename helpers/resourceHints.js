'use strict';

const utils = require('handlebars-utils');
const getFonts = require('./lib/fonts');
const {
    addResourceHint,
    resourceHintAllowedStates,
    resourceHintAllowedTypes,
    resourceHintAllowedCors
} = require('./lib/resourceHints');

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
    return function () {

        let hosts = [];

        // Add cdn
        const siteSettings = globals.getSiteSettings();
        const cdnUrl = siteSettings['cdn_url'] || '';
        if (utils.isString(cdnUrl)) {
            hosts.push(cdnUrl);
        }

        // Add font providers
        const fonts = getFonts('providerLists', globals.getThemeSettings(), globals.handlebars);
        for (const provider in fonts) {
            if (typeof fontResources[provider] !== 'undefined') {
                hosts = hosts.concat(fontResources[provider]);
            }
        }

        hosts.forEach(host => {
            addResourceHint(
                globals,
                host,
                resourceHintAllowedStates.dnsPrefetchResourceHintState,
                resourceHintAllowedTypes.resourceHintFontType,
                resourceHintAllowedCors.noCors
            );
        });

        return new globals.handlebars.SafeString(hosts.map(host => format(host)).join(''));
    };
};

module.exports = [{
    name: 'resourceHints',
    factory: factory,
}];
