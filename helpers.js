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
    'get',
    'getContentImage',
    'getContentImageSrcset',
    'getFontLoaderConfig',
    'getFontsCollection',
    'getImage',
    'getImageManagerImage',
    'getImageManagerImageSrcset',
    'getImageSrcset',
    'getImageSrcset1x2x',
    'getObject',
    'getVar',
    'helperMissing',
    'if',
    'incrementVar',
    'inject',
    'join',
    'jsContext',
    'json',
    'jsonParseSafe',
    'lang',
    'langJson',
    'limit',
    'moment',
    'money',
    'multiConcat',
    'nl2br',
    'occurrences',
    'option',
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
    'strReplace',
    'stylesheet',
    'thirdParty',
    'toLowerCase',
    'truncate',
    'unless',
    'earlyHint',
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
