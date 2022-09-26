/*!
 * COPY of https://raw.githubusercontent.com/jonschlinkert/arr-filter/1.1.1/index.js
 */

'use strict';

const iterator = require('./makeIterator');

module.exports = function filter(arr, cb, thisArg) {
  if (!arr) {
    return [];
  }

  if (typeof cb !== 'function') {
    throw new TypeError('arr-filter expects a callback function.');
  }

  cb = iterator(cb, thisArg);
  var len = arr.length;
  var res = arr.slice();
  var i = 0;

  while (len--) {
    if (!cb(arr[len], i++)) {
      res.splice(len, 1);
    }
  }

  return res;
};
