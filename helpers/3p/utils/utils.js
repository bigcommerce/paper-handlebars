'use strict';

/**
 * Expose `utils`
 */

module.exports = {
  "sortBy": require('array-sort'),
  "flatten": require('arr-flatten'),

  // Html utils
  "block": require('to-gfm-code-block'),
  "tag": require('html-tag'),

  // JavaScript language utils
  "typeOf": require('kind-of'),

  // matching utils
  "isGlob": require('is-glob'),
  "mm": require('micromatch'),
  "falsey": require('falsey'),

  // Number utils
  "isEven": require('is-even'),
  "isNumber": require('is-number'),

  // Object utils
  "createFrame": require('create-frame'),
  "getObject": require('get-object'),
  "get": require('get-value'),
  "forOwn": require('for-own'),

  // Path utils
  // FIXME not sure where this is used 
  // "relative": require('relative'),
};
