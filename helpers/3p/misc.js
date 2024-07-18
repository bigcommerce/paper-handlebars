'use strict';

/**
 * Expose `helpers`
 */

var helpers = module.exports;

/**
 * Returns the first value if defined, otherwise the "default" value is returned.
 *
 * @param {any} `value`
 * @param {any} `defaultValue`
 * @return {String}
 * @alias .or
 * @api public
 */

helpers.default = function(...args) {
  args.pop();
  const value = args.shift();
  const defaultValue = args.shift();
  return !value
    ? defaultValue
    : value;
};


/**
 * Block helper that renders the block without taking any arguments.
 *
 * @param {Object} `options`
 * @return {String}
 * @block
 * @api public
 */

helpers.noop = function(options) {
  return options.fn(this);
};

/**
 * Block helper that builds the context for the block
 * from the options hash.
 *
 * @param {Object} `options` Handlebars provided options object.
 * @contributor Vladimir Kuznetsov <https://github.com/mistakster>
 * @block
 * @api public
 */

helpers.withHash = function(options) {
  if (options.hash && Object.keys(options.hash).length) {
    return options.fn(options.hash);
  } else {
    return options.inverse(this);
  }
};