'use strict';
// const url = require('url');

// import { URL } from 'url-shim';
const Url = require('url-parse');

export function isValidURL(val) {
    try {
        let url = new Url(val);
        return url.host !== null;
    } catch (e) {
        return false;
    }
}

export function unwrapIfSafeString(handlebars, val) {
    if (val instanceof handlebars.SafeString) {
        val = val.toString();
    }
    return val;
}

export const maximumPixelSize = 5120;

// export default {
//     "isValidURL": isValidURL,
//     "unwrapIfSafeString": unwrapIfSafeString,
//     "maximumPixelSize": maximumPixelSize,
// };
