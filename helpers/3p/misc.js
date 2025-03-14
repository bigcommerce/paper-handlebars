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
 * @return {String}
 * @block
 * @api public
 */

helpers.noop = function() {
  const options = arguments[arguments.length - 1];
  return options.fn(this);
};

/**
 * Block helper that builds the context for the block
 * from the options hash.
 *
 * @contributor Vladimir Kuznetsov <https://github.com/mistakster>
 * @block
 * @api public
 */

helpers.withHash = function() {
  const options = arguments[arguments.length - 1];
  if (options.hash && Object.keys(options.hash).length) {
    return options.fn(options.hash);
  } else {
    return options.inverse(this);
  }
};