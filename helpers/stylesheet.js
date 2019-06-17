
'use strict';

const buildCDNHelper = require('./lib/cdnify');

const factory = globals => {
    return function(assetPath, options) {
        const cdnify = buildCDNHelper(globals);
        const siteSettings = globals.getSiteSettings();
        const configId = siteSettings.theme_config_id;

        // append the configId only if the asset path starts with assets/css/
        const path = configId && assetPath.match(/^\/?assets\/css\//)
            ? assetPath.replace(/\.css$/, `-${configId}.css`)
            : assetPath;

        const url = cdnify(path);

        const attrs = Object.assign({ rel: 'stylesheet' }, options.hash);
        const attributeKeys = Object.keys(attrs);
        const attributes = [];

        for (let i = 0; i < attributeKeys.length; i++) {
            attributes.push(`${attributeKeys[i]}="${attrs[attributeKeys[i]]}"`);
        }

        return `<link data-stencil-stylesheet href="${url}" ${attributes.join(' ')}>`;
    };
};

module.exports = [{
    name: 'stylesheet',
    factory: factory,
}];