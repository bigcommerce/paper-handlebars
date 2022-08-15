'use strict';

const _ = require('lodash');
const buildCDNHelper = require('./lib/cdnify');
const {addResourceHint, resourceHintAllowedTypes} = require('./lib/resourceHints');

const factory = globals => {
    return function (assetPath) {
        const cdnify = buildCDNHelper(globals);
        const siteSettings = globals.getSiteSettings();
        const configId = siteSettings.theme_config_id;

        const options = arguments[arguments.length - 1];

        // append the configId only if the asset path starts with assets/css/
        const path = configId && assetPath.match(/^\/?assets\/css\//)
            ? assetPath.replace(/\.css$/, `-${configId}.css`)
            : assetPath;

        const url = cdnify(path);

        if (_.has(options.hash, 'resourceHint')) {
            addResourceHint(
                globals,
                url,
                options.hash['resourceHint'],
                resourceHintAllowedTypes.resourceHintStyleType
            );
            delete options.hash.resourceHint;
        }

        let attrs = {rel: 'stylesheet'};
        Object.assign(attrs, options.hash);
        attrs = _.map(attrs, (value, key) => `${key}="${value}"`).join(' ');
        return `<link data-stencil-stylesheet href="${url}" ${attrs}>`;
    };
};

module.exports = [{
    name: 'stylesheet',
    factory: factory,
}];
