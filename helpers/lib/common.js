'use strict';
const URL = require('url').URL;

function isValidURL(val) {
    try {
        new URL(val);
        return true;
    } catch (_) {
        return false;
    }
}

module.exports = {
    isValidURL,
};
