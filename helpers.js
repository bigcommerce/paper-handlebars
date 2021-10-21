const helpersList = [
    'all',
    'any',
    'assignVar',
    'block',
    'cdn',
    'compare',
    'concat',
    'contains',
    'decrementVar',
    'dynamicComponent',
    'encodeHtmlEntities',
    'for',
    'getContentImage',
    'getContentImageSrcset',
    'getFontLoaderConfig',
    'getFontsCollection',
    'getImage',
    'getImageManagerImage',
    'getImageManagerImageSrcset',
    'getImageSrcset',
    'getImageSrcset1x2x',
    'getVar',
    'helperMissing',
    'if',
    'incrementVar',
    'inject',
    'join',
    'jsContext',
    'json',
    'lang',
    'langJson',
    'limit',
    'money',
    'nl2br',
    'occurrences',
    'or',
    'partial',
    'pluck',
    'pre',
    'region',
    'replace',
    'resourceHints',
    'setURLQueryParam',
    'snippets',
    'stripQuerystring',
    'stylesheet',
    'thirdParty',
    'toLowerCase',
    'truncate',
    'unless',
];

const deprecatedHelpersList = [
    'enumerate',
    'equals',
    'getShortMonth',
    'pick'
];

let helpers = [];

helpersList.forEach(helper => {
    helpers = [...helpers, ...require(`./helpers/${helper}.js`)];
})

deprecatedHelpersList.forEach(helper => {
    helpers = [...helpers, ...require(`./helpers/deprecated/${helper}.js`)];
})

// Export full list of helpers
module.exports = helpers;
