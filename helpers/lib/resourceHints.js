const utils = require("../3p/utils");

const resourceHintsLimit = 50;

const preloadResourceHintState = 'preload';
const preconnectResourceHintState = 'preconnect';
const prerenderResourceHintState = 'prerender';
const dnsPrefetchResourceHintState = 'dns-prefetch';
const resourceHintStates = [preloadResourceHintState, preconnectResourceHintState, prerenderResourceHintState, dnsPrefetchResourceHintState];

const resourceHintFontType = 'font';
const resourceHintStyleType = 'style';
const resourceHintScriptType = 'script';
const resourceHintTypes = [resourceHintStyleType, resourceHintFontType, resourceHintScriptType];

const noCors = 'no';
const anonymousCors = 'anonymous';
const useCredentialsCors = 'use-credentials';
const allowedCors = [noCors, anonymousCors, useCredentialsCors];

/**
 * @param {string} path - The uri to the resource.
 * @param {string} state - any of [preload, preconnect, prerender, dns-prefetch]
 * @param {string} type? - any of [style, font, script] If an invalid value is provided, property won't be included
 * @param {string} cors? - any of [no, anonymous, use-credentials] defaults to no when no value is provided
 */
function addResourceHint(globals, path, state, type, cors) {

    if (!utils.isString(path)) {
        throw new Error('Invalid path provided. path should be a non empty string');
    }
    path = path.trim();

    if (!utils.isString(state) || !resourceHintStates.includes(state)) {
        throw new Error(`resourceHint attribute received invalid value. Valid values are: ${resourceHintStates}`);
    }

    if (typeof globals.resourceHints === 'undefined') {
        globals.resourceHints = [];
    }

    let index = globals.resourceHints.findIndex(({ src }) => path === src);
    if (index >= 0) {
        return;
    }

    if (globals.resourceHints.length >= resourceHintsLimit) {
        return;
    }

    let hint = { src: path, state };

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
