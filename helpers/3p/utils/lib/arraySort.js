'use strict';

/*

    Copy of https://github.com/jonschlinkert/array-sort/blob/0.1.2/index.js

*/
const { getValue } = require('../../../lib/common');
const { ValidationError } = require('../../../../lib/errors');

/**
 * Sort an array of objects by one or more properties.
 *
 * @param  {Array} `arr` The Array to sort.
 * @return {Array} Returns a sorted array.
 * @api public
 */

function arraySort(arr) {
  const options = arguments[arguments.length - 1];
  if (!arr) {
    return [];
  }

  if (!Array.isArray(arr)) {
    throw new ValidationError('array-sort expects an array.');
  }

  if (arguments.length === 1) {
    return arr.sort();
  }

  var args = flatten([].slice.call(arguments, 1));

  return arr.sort(sortBy(args, options));
}

/**
 * Iterate over each comparison property or function until `1` or `-1`
 * is returned.
 *
 * @param  {String|Array|Function} `props` One or more object paths or comparison functions.
 * @param  {Object} `opts` Pass `{ reverse: true }` to reverse the sort order.
 * @return {Array}
 */

function sortBy(props, opts) {
  opts = opts || {};

  return function compareFn(a, b) {
    var len = props.length, i = -1;
    var result;

    while (++i < len) {
      result = compare(props[i], a, b);
      if (result !== 0) {
        break;
      }
    }
    if (opts.reverse === true) {
      return result * -1;
    }
    return result;
  };
}

/**
 * Compare `a` to `b`. If an object `prop` is passed, then
 * `a[prop]` is compared to `b[prop]`
 */

function compare(prop, a, b) {
  if (typeof prop === 'function') {
    // expose `compare` to custom function
    return prop(a, b, compare.bind(null, null));
  }
  // compare object values
  if (prop && typeof a === 'object' && typeof b === 'object') {
    return compare(null, getValue(a, prop), getValue(b, prop));
  }
  return defaultCompare(a, b);
}

/**
 * Default compare function used as a fallback
 * for sorting.
 */

function defaultCompare(a, b) {
  return a < b ? -1 : (a > b ? 1 : 0);
}

/**
 * Flatten the given array.
 */

function flatten(arr) {
  return [].concat.apply([], arr);
}

/**
 * Expose `arraySort`
 */

module.exports = arraySort;