'use strict';

/**
 * Copy of https://raw.githubusercontent.com/i-voted-for-trump/is-even/0.1.2/index.js
 */

var isOdd = require('./isOdd');

module.exports = function isEven(i) {
  return !isOdd(i);
};