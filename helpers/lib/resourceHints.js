const utils = require("handlebars-utils");

const resourceHintsLimit = 50;

const defaultResourceHintState = 'preload';

const resourceHintStates = [defaultResourceHintState, 'preconnect', 'prefetch'];

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

    path = utils.escapeExpression(path);
    let index = globals.resourceHints.findIndex(({src}) => path === src);
    if (index >= 0) {
        return;
    }

    if (globals.resourceHints.length >= resourceHintsLimit) {
        return;
    }

    let value = {src: path, state};

    if (typeof type !== 'string') {
        type = '';
    }
    type = type.trim();
    if (type !== '' && resourceHintAllowedTypes.includes(type)) {
        value.type = type;
    }

    globals.resourceHints.push(value);
}

module.exports = {
    resourceHintsLimit,
    defaultResourceHintState,
    addResourceHint,
    resourceHintAllowedTypes: {resourceHintStyleType, resourceHintFontType, resourceHintScriptType}
};
