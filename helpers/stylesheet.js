'use strict';

const buildCDNHelper = require('./lib/cdnify');
const {
    addResourceHint,
    resourceHintAllowedTypes,
    resourceHintAllowedCors,
    defaultResourceHintState
} = require('./lib/resourceHints');
const utils = require('./3p/utils');

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
        if (utils.isString(url)) {
            const cross = options.hash.crossorigin || resourceHintAllowedCors.noCors;
            try {
                const hintPath = addResourceHint(
                    globals,
                    url,
                    defaultResourceHintState,
                    resourceHintAllowedTypes.resourceHintStyleType,
                    cross
                );

                if (utils.isString(hintPath)) {
                    url = hintPath;
                } else {
                    console.warn(`Early hint generated and invalid path [${hintPath}]. stylesheet tag won't be using it.`);
                }
            } catch (e) {
                console.error(`Early hint generation failed for path [${url}]`, e);
            }
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
