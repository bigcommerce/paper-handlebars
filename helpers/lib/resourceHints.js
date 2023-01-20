const utils = require("../3p/utils");
const URL = require('url');

const resourceHintsLimit = 50;

const preloadResourceHintState = 'preload';
const preconnectResourceHintState = 'preconnect';
const prerenderResourceHintState = 'prerender';
const dnsPrefetchResourceHintState = 'dns-prefetch';
const resourceHintStates = [preloadResourceHintState, preconnectResourceHintState, prerenderResourceHintState, dnsPrefetchResourceHintState];

const resourceHintFontType = 'font';
const resourceHintStyleType = 'style';
const resourceHintScriptType = 'script';
const resourceHintDocumentType = 'document';
const resourceHintTypes = [resourceHintStyleType, resourceHintFontType, resourceHintScriptType, resourceHintDocumentType];

const noCors = 'no';
const anonymousCors = 'anonymous';
const useCredentialsCors = 'use-credentials';
const allowedCors = [noCors, anonymousCors, useCredentialsCors];

/**
 * @param {string} path - The uri to the resource.
 * @param {string} rel - any of [preload, preconnect, prerender, dns-prefetch]
 * @param {string} type? - (as attr in HTML link tag) any of [style, font, script,document] If an invalid value is provided, property won't be included
 * @param {string} cors? - (crossorigin attr in HTML tag) any of [no, anonymous, use-credentials] defaults to no when no value is provided
 */
function addResourceHint(globals, path, rel, type, cors) {

    if (!utils.isString(path)) {
        throw new Error('Invalid path provided. path should be a non empty string');
    }
    path = path.trim();
    try {
        path = URL.parse(path).format();
    } catch (error) {
        throw new Error(`Invalid value (resource URL) provided: ${path}`)
    }

    if (!utils.isString(rel) || !resourceHintStates.includes(rel)) {
        throw new Error(`resourceHint attribute received invalid value. Valid values are: ${resourceHintStates}`);
    }

    if (typeof globals.resourceHints === 'undefined') {
        globals.resourceHints = [];
    }

    let index = globals.resourceHints.findIndex(({ src }) => path === src);
    if (index >= 0) {
        return path;
    }

    if (globals.resourceHints.length >= resourceHintsLimit) {
        console.warn(`Resource hint for [${path}] due to the max limit of allowed hints was reached.`);
        return path;
    }

    let hint = {src: path, state: rel};

    if (utils.isString(type) && resourceHintTypes.includes(type)) {
        hint.type = type;
    }

    if (utils.isString(cors) && !allowedCors.includes(cors)) {
        throw new Error(`Invalid cors value provided. Valid values are: ${allowedCors}`);
    } else if (!utils.isString(cors)) {
        cors = noCors;
    }
    hint.cors = cors;

    globals.resourceHints.push(hint);

    return path;
}

module.exports = {
    resourceHintsLimit,
    defaultResourceHintState: preloadResourceHintState,
    addResourceHint,
    resourceHintAllowedTypes: { resourceHintStyleType, resourceHintFontType, resourceHintScriptType },
    resourceHintAllowedCors: { noCors, anonymousCors, useCredentialsCors },
    resourceHintAllowedStates: {
        preloadResourceHintState,
        preconnectResourceHintState,
        prerenderResourceHintState,
        dnsPrefetchResourceHintState
    }
};
