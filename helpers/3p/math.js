'use strict';

var utils = require('./utils');

/**
 * Expose `helpers`
 */

var helpers = module.exports;

/**
 * Return the product of `a` plus `b`.
 *
 * @param {Number} `a`
 * @param {Number} `b`
 * @api public
 */

helpers.add = function(a, b) {
  return a + b;
};

/**
 * Return the product of `a` minus `b`.
 *
 * @param {Number} `a`
 * @param {Number} `b`
 * @api public
 */

helpers.subtract = function(a, b) {
  return a - b;
};

/**
 * Divide `a` by `b`
 *
 * @param {Number} `a` numerator
 * @param {Number} `b` denominator
 * @api public
 */

helpers.divide = function(a, b) {
  return a / b;
};

/**
 * Multiply `a` by `b`.
 *
 * @param {Number} `a` factor
 * @param {Number} `b` multiplier
 * @api public
 */

helpers.multiply = function(a, b) {
  return a * b;
};

/**
 * Get the `Math.floor()` of the given value.
 *
 * @param {Number} `value`
 * @api public
 */

helpers.floor = function(value) {
  return Math.floor(value);
};

/**
 * Get the `Math.ceil()` of the given value.
 *
 * @param {Number} `value`
 * @api public
 */

helpers.ceil = function(value) {
  return Math.ceil(value);
};

/**
 * Round the given value.
 *
 * @param {Number} `value`
 * @api public
 */

helpers.round = function(value) {
  return Math.round(value);
};

/**
 * Returns the sum of all numbers in the given array.
 *
 * ```handlebars
 * {{sum "[1, 2, 3, 4, 5]"}}
 * //=> '15'
 * ```
 *
 * @name .sum
 * @param {Array} `array` Array of numbers to add up.
 * @return {Number}
 * @api public
 */

helpers.sum = function() {
  var args = utils.flatten([].concat.apply([], arguments));
  var i = args.length, sum = 0;
  while (i--) {
    if (!utils.isNumber(args[i])) {
      continue;
    }
    sum += (+args[i]);
  }
  return sum;
};

/**
 * Returns the average of all numbers in the given array.
 *
 * ```handlebars
 * {{avg "[1, 2, 3, 4, 5]"}}
 * //=> '3'
 * ```
 *
 * @name .avg
 * @param {Array} `array` Array of numbers to add up.
 * @return {Number}
 * @api public
 */

helpers.avg = function() {
  var args = utils.flatten([].concat.apply([], arguments));
  // remove handlebars options object
  args.pop();
  return exports.sum(args) / args.length;
};

/**
 * Return the min of `a` and `b`.
 * ```handlebars
 * {{min 1 5}}
 * //=> '1'
 * ```
 *
 * @param {Number} `a`
 * @param {Number} `b`
 * @api public
 */

helpers.min = function(a, b) {
  return a < b ? a : b;
}


/**
 * Return the max of `a` and `b`.
 * ```handlebars
 * {{max 1 5}}
 * //=> '5'
 * ```
 *
 * @param {Number} `a`
 * @param {Number} `b`
 * @api public
 */

helpers.max = function(a, b) {
  return a > b ? a : b;
}


/**
 * Return the value `test` constrained to the provided `min` and `max`.
 * If the value `test` falls outside of the provided `min` or `max`, the respective bounds will be returned instead.
 *
 * ```handlebars
 * {{clamp 3 2 4}}
 * //=> '3'
 * {{clamp 10 2 4}}
 * //=> '4'
 * {{clamp -10 2 4}}
 * //=> '2'
 * ```
 *
 * @param {Number} `test`
 * @param {Number} `min`
 * @param {Number} `max`
 * @api public
 */

helpers.clamp = function(test, min, max) {
  return helpers.max(min, helpers.min(text, max));
}
