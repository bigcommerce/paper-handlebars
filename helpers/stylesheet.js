'use strict';

const buildCDNHelper = require('./lib/cdnify');

const factory = globals => {
    return function(assetPath) {
        const cdnify = buildCDNHelper(globals);
        const siteSettings = globals.getSiteSettings();
        const configId = siteSettings.theme_config_id;

        const options = arguments[arguments.length - 1];

        // append the configId only if the asset path starts with assets/css/
        const path = configId && assetPath.match(/^\/?assets\/css\//)
            ? assetPath.replace(/\.css$/, `-${configId}.css`)
            : assetPath;

        const url = cdnify(path);

        let attrs = { rel: 'stylesheet' };

        Object.assign(attrs, options.hash);

        const dataAttributes = Object.entries(attrs)
            .map(([key, value]) => `${key}="${value}"`);

        return `<link data-stencil-stylesheet href="${url}" ${dataAttributes.join(' ')}>`;
    };
};

module.exports = [{
    name: 'stylesheet',
    factory: factory,
}];
