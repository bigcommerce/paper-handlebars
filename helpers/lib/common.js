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
    maximumPixelSize,
    appendLossyParam
};
