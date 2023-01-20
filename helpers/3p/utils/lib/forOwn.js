
/*
* COPY of https://github.com/jonschlinkert/for-own/tree/0.1.5/index.js
*/

'use strict';

var forIn = require('./forIn');
var hasOwn = Object.prototype.hasOwnProperty;

module.exports = function forOwn(obj, fn, thisArg) {
  forIn(obj, function(val, key) {
    if (hasOwn.call(obj, key)) {
      return fn.call(thisArg, obj[key], key, obj);
    }
  });
};