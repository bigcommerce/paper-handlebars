'use strict';

const URL = require('url');

const buildCDNHelper = require('./lib/cdnify');
const {addResourceHint, resourceHintAllowedTypes} = require('./lib/resourceHints');

const factory = globals => {
    const cdnify = buildCDNHelper(globals);

    return function (assetPath) {
        const siteSettings = globals.getSiteSettings();
        const configId = siteSettings.theme_config_id;

        const options = arguments[arguments.length - 1];

        // append the configId only if the asset path starts with assets/css/
        const path = configId && assetPath.match(/^\/?assets\/css\//)
            ? assetPath.replace(/\.css$/, `-${configId}.css`)
            : assetPath;

        let url = cdnify(path);


        if (options.hash.resourceHint) {
            url = addResourceHint(
                globals,
                url,
                options.hash.resourceHint,
                resourceHintAllowedTypes.resourceHintStyleType
            );
            delete options.hash.resourceHint;
        }

        const attrs = Object.assign({rel: 'stylesheet'}, options.hash);
        const keyValuePairs = [];
        for (const attrsKey in attrs) {
            keyValuePairs.push(`${attrsKey}="${attrs[attrsKey]}"`);
        }

        return `<link data-stencil-stylesheet href="${url}" ${keyValuePairs.join(' ')}>`;
    };
};

module.exports = [{
    name: 'stylesheet',
    factory: factory,
}];
