/*
Copy form https://github.com/i-voted-for-trump/is-odd/blob/0.1.2/index.js
*/
'use strict';

const isNumber = require('./isNumber');

module.exports = function isOdd(i) {
  if (!isNumber(i)) {
    throw new TypeError('is-odd expects a number.');
  }
  if (Number(i) !== Math.floor(i)) {
    throw new RangeError('is-odd expects an integer.');
  }
  return !!(~~i & 1);
};