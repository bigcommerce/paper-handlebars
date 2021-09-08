'use strict';
const url = require('url');

function isValidURL(val) {
    try {
        return url.parse(val).hostname !== null;
    } catch (e) {
        return false;
    }
}

function unwrapIfSafeString(handlebars, val) {
    if (val instanceof handlebars.SafeString) {
        val = val.toString();
    }
    return val;
}

module.exports = {
    isValidURL,
    unwrapIfSafeString
};
