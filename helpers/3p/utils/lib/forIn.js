/*
 * COPY of https://github.com/jonschlinkert/for-in/blob/1.0.1/index.js
 */

'use strict';

module.exports = function forIn(obj, fn, thisArg) {
  for (var key in obj) {
    if (fn.call(thisArg, obj[key], key, obj) === false) {
      break;
    }
  }
};