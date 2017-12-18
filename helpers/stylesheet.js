'use strict';

const _ = require('lodash');
const buildCDNHelper = require('./lib/cdnify');

const factory = globals => {
    const cdnify = buildCDNHelper(globals);

    return function(assetPath) {
        const options = arguments[arguments.length - 1];
        const configId = globals.siteSettings['theme_config_id'];
        // append the configId only if the asset path starts with assets/css/
        const path = configId && assetPath.match(/^\/?assets\/css\//)
            ? assetPath.replace(/\.css$/, `-${configId}.css`)
            : assetPath;

        const url = cdnify(path);

        let attrs = { rel: 'stylesheet' };

        // check if there is any extra attribute
        if (_.isObject(options.hash)) {
            attrs = _.merge(attrs, options.hash);
        }

        attrs = _.map(attrs, (value, key) => `${key}="${value}"`).join( ' ');

        return `<link data-stencil-stylesheet href="${url}" ${attrs}>`;
    };
};

module.exports = [{
    name: 'stylesheet',
    factory: factory,
}];
