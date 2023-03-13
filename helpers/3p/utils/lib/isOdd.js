/*
Copy form https://github.com/i-voted-for-trump/is-odd/blob/0.1.2/index.js
*/
'use strict';

const { ValidationError } = require('../../../../lib/errors');
const isNumber = require('./isNumber');

module.exports = function isOdd(i) {
  if (!isNumber(i)) {
    throw new ValidationError('is-odd expects a number.');
  }
  if (Number(i) !== Math.floor(i)) {
    throw new ValidationError('is-odd expects an integer.');
  }
  return !!(~~i & 1);
};