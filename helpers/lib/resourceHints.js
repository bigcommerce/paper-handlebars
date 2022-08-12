/* eslint-disable curly */
const _ = require("lodash");
const utils = require("handlebars-utils");

const resourceHintsLimit = 50;

const defaultResourceHintSate = 'preload';

const resourceHintStates = [defaultResourceHintSate, 'preconnect', 'prefetch'];

const resourceHintFontType = 'font';
const resourceHintStyleType = 'style';
const resourceHintScriptType = 'script';
const resourceHintAllowedTypes = [resourceHintStyleType, resourceHintFontType, resourceHintScriptType];

/**
 * @param {string} path - The uri to the resource.
 * @param {string} state - 'preload' or 'preconnect'
 * @param {string} type - any of [style, font, script]
 */
function addResourceHint(globals, path, state, type) {

    path = _.trim(path);
    if (path === '') {
        return;
    }

    state = _.trim(state);
    if (!resourceHintStates.includes(state)) {
        return;
    }

    if (typeof globals.resourceHints === 'undefined') {
        globals.resourceHints = [];
    }

    path = utils.escapeExpression(path);
    let index = globals.resourceHints.findIndex(({src}) => path === src);
    if (index >= 0) {
        return;
    }

    if (globals.resourceHints.length >= resourceHintsLimit) {
        return;
    }

    let value = Object.create({});
    Object.defineProperty(value, 'src', {value: path, writable: false});
    Object.defineProperty(value, 'state', {value: state, writable: false});

    type = _.trim(type);
    if (type !== '' && _.includes(resourceHintAllowedTypes, type)) {
        Object.defineProperty(value, 'type', {value: type, writable: false});
    }

    globals.resourceHints.push(value);
}

module.exports = {
    resourceHintsLimit,
    defaultResourceHintSate,
    addResourceHint,
    resourceHintAllowedTypes: {resourceHintStyleType, resourceHintFontType, resourceHintScriptType}
};
