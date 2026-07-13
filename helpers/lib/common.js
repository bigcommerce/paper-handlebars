'use strict';
const url = require('url');

function isValidURL(val) {
    try {
        return url.parse(val).hostname !== null;
    } catch (e) {
        return false;
    }
}

/*
 * Based on https://github.com/jonschlinkert/get-value/blob/2.0.6/index.js with some enhancements.
 *
 * - Performs "hasOwnProperty" checks for safety.
 * - Now accepts Handlebars.SafeString paths.
 */
function getValue(object, path, globals) {
    let parts;

    // for backwards compatibility
    if (!path) {
        return object;
    }

    // unwrap Handlebars.SafeString for compatibility with `concat` etc.
    if (globals && globals.handlebars) {
        path = unwrapIfSafeString(globals.handlebars, path);
    }

    // accept array or string for backwards compatibility
    if (typeof path === 'string') {
        parts = path.split('.');
    } else if (Array.isArray(path)) {
        parts = path;
    } else {
        let key = String(path);
        return Object.keys(object).indexOf(key) !== -1 ? object[key] : undefined;
    }

    let result = object;
    let prefix = '';
    for (let key of parts) {
        if (result === undefined || result === null) {
            return undefined;
        }
        // preserve handling of trailing backslashes for backwards compatibility
        if (key.slice(-1) === '\\') {
            prefix = prefix + key.slice(0, -1) + '.';
            continue;
        }
        key = prefix + key;
        if (Object.keys(result).indexOf(key) !== -1) {
            result = result[key];
            prefix = '';
        } else {
            return;
        }
    }
    return result;
}

function unwrapIfSafeString(handlebars, val) {
    if (val instanceof handlebars.SafeString) {
        val = val.toString();
    }
    return val;
}

// Maps the char code of characters that are valid inside a JSON string but
// dangerous when that JSON is emitted (unescaped) inside an HTML <script> tag,
// to their \uXXXX escape sequences. Encoding `<` and `/` prevents the HTML
// parser from ever seeing a closing tag such as `</script>`; `>` guards
// against `-->`/`]]>`; U+2028/U+2029 are illegal in JS string literals. Every
// replacement is still valid JSON and round-trips through `JSON.parse`.
const HTML_UNSAFE_JSON_ESCAPES = {
    0x3c: '\\u003c', // <
    0x3e: '\\u003e', // >
    0x2f: '\\u002f', // /
    0x2028: '\\u2028',
    0x2029: '\\u2029',
};

const HTML_UNSAFE_JSON_REGEX = /[<>/\u2028\u2029]/g;

/**
 * Escape the output of `JSON.stringify` so it can be safely embedded inside an
 * HTML <script> tag. Encodes `<`, `>`, `/` and the U+2028/U+2029 line
 * separators as unicode escape sequences. The result is still valid JSON and
 * round-trips through `JSON.parse`.
 *
 * @param {string} jsonString - The output of JSON.stringify
 * @returns {string} - The HTML-safe JSON string
 */
function escapeJsonForHtml(jsonString) {
    if (typeof jsonString !== 'string') {
        return jsonString;
    }
    return jsonString.replace(HTML_UNSAFE_JSON_REGEX, char => HTML_UNSAFE_JSON_ESCAPES[char.charCodeAt(0)]);
}

const maximumPixelSize = 5120;

/**
 * Append compression=lossy query parameter to a URL if lossy is true
 * @param {string} url - The URL to modify
 * @param {boolean} lossy - Whether to append the lossy compression parameter
 * @returns {string} - The modified URL
 */
function appendLossyParam(url, lossy) {
    if (!lossy || typeof lossy !== 'boolean') {
        return url;
    }

    const urlObj = new URL(url);
    urlObj.searchParams.set('compression', 'lossy');
    return urlObj.toString();
}

module.exports = {
    isValidURL,
    getValue,
    unwrapIfSafeString,
    escapeJsonForHtml,
    maximumPixelSize,
    appendLossyParam
};
