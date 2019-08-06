'use strict';
const URL = require('url').URL;
const SafeString = require('handlebars').SafeString;

function isValidURL(val) {
    try {
        new URL(val);
        return true;
    } catch (_) {
        return false;
    }
}

function unwrapIfSafeString(val) {
    if (val instanceof SafeString) {
        val = val.toString();
    }
    return val;
}

module.exports = {
    isValidURL,
    unwrapIfSafeString
};
