'use strict';
const url = require('url');
const SafeString = require('handlebars').SafeString;

function isValidURL(val) {
    try {
        return url.parse(val).hostname !== null;
    } catch (e) {
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
