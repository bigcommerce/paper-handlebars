'use strict';

var utils = require('./base');

/**
 * Returns true if the given value is an object.
 *
 * ```js
 * console.log(utils.isObject(null));
 * //=> false
 * console.log(utils.isObject([]));
 * //=> false
 * console.log(utils.isObject(function() {}));
 * //=> false
 * console.log(utils.isObject({}));
 * //=> true
 * ```
 * @param {Object} `val`
 * @return {Boolean}
 * @api public
 */
utils.isObject = function (val) {
  return typeof val === 'object';
};

/**
 * Returns true if the given value contains the given
 * `object`, optionally passing a starting index.
 *
 * @param {Array} val
 * @param {Object} obj
 * @param {Number} start
 * @return {Boolean}
 */

utils.contains = function (val, obj, start) {
  var len = val ? val.length : 0;
  var idx = start < 0
    ? Math.max(0, len + start)
    : start;

  var res = false;
  var i = 0;

  start = idx || 0;

  if (Array.isArray(val)) {
    res = utils.indexOf(val, obj, start) > -1;

  } else if (utils.isNumber(len)) {
    res = (typeof val === 'string'
      ? val.indexOf(obj, start)
      : utils.indexOf(val, obj, start)) > -1;

  } else {
    utils.iterator(val, function (ele) {
      if (start < i++) {
        return !(res = (ele === obj));
      }
    });
  }
  return res;
};

/**
 * Converts a "regex-string" to an actual regular expression.
 *
 * ```js
 * utils.toRegex('"/foo/"');
 * //=> /foo/
 * ```
 * @param {Object} `value`
 * @return {Boolean}
 * @api public
 */

utils.toRegex = function (val) {
  return new RegExp(val.replace(/^\/|\/$/g, ''));
};

/**
 * Returns true if the given value appears to be a
 * regular expression.
 *
 * @param {Object} `value`
 * @return {Boolean}
 * @api public
 */

utils.isRegex = function (val) {
  if (utils.typeOf(val) === 'regexp') {
    return true;
  }
  if (typeof val !== 'string') {
    return false;
  }
  return val.charAt(0) === '/'
    && val.slice(-1) === '\/';
};

/**
 * Remove leading and trailing whitespace and non-word
 * characters from the given string.
 *
 * @param {String} `str`
 * @return {String}
 */

utils.chop = function (str) {
  if (!utils.isString(str)) { return ''; }
  var re = /^[-_.\W\s]+|[-_.\W\s]+$/g;
  return str.trim().replace(re, '');
};

/**
 * Change casing on the given `string`, optionally
 * passing a delimiter to use between words in the
 * returned string.
 *
 * ```js
 * utils.changecase('fooBarBaz');
 * //=> 'foo bar baz'
 *
 * utils.changecase('fooBarBaz' '-');
 * //=> 'foo-bar-baz'
 * ```
 * @param  {String} `string` The string to change.
 * @return {String}
 * @api public
 */

utils.changecase = function (str, fn) {
  if (!utils.isString(str)) { return ''; }
  if (str.length === 1) {
    return str.toLowerCase();
  }

  str = utils.chop(str).toLowerCase();
  if (typeof fn !== 'function') {
    fn = utils.identity;
  }

  var re = /[-_.\W\s]+(\w|$)/g;
  return str.replace(re, function (_, ch) {
    return fn(ch);
  });
};

/**
 * Generate a random number
 *
 * @param  {Number} `min`
 * @param  {Number} `max`
 * @return {Number}
 * @api public
 */

utils.random = function (min, max) {
  return min + Math.floor(Math.random() * (max - min + 1));
};

/**
 * Returns true if the given value is `undefined` or
 * is a handlebars options hash.
 *
 * @param {any} `value`
 * @return {Boolean}
 * @api public
 */

utils.isUndefined = function (val) {
  return typeof val === 'undefined'
    || (val && !!val.hash);
};

/**
 * Returns true if the given value appears to be an **options** object.
 *
 * @param {Object} `value`
 * @return {Boolean}
 * @api public
 */

utils.isOptions = function (val) {
  return utils.isObject(val) && Object.hasOwnProperty.call(val, 'hash');
};

/**
 * Get options from the options hash and `this`.
 *
 * @param {Object} `app` The current application instance.
 * @return {Object}
 * @api public
 */

utils.getArgs = function (app, args) {
  var opts = utils.merge({}, app && app.options);
  if (!Array.isArray(args)) {
    args = [].slice.call(args);
  }

  var last = args[args.length - 1];

  // merge `options.hash` into the options
  if (utils.isOptions(last)) {
    var hbsOptions = args.pop();
    opts = utils.get(opts, hbsOptions.name) || opts;
    opts = utils.merge({}, opts, hbsOptions.hash);

    // if the last arg is an object, merge it
    // into the options
  } else if (utils.isObject(last)) {
    opts = utils.merge({}, opts, args.pop());
  }

  args.push(opts);
  return args;
};

/**
 * Returns true if the given value is an object
 * and not an array.
 *
 * @param {any} `value`
 * @return {Boolean}
 * @api public
 */

utils.isObject = function (val) {
  return val && typeof val === 'object'
    && !Array.isArray(val);
};

/**
 * Returns true if the given value is empty.
 *
 * @param {any} `value`
 * @return {Boolean}
 * @api public
 */

utils.isEmpty = function (val) {
  if (val === 0 || val === '0') {
    return false;
  }
  if (!val || (Array.isArray(val) && val.length === 0)) {
    return true;
  }
  if (typeof val === 'object' && !Object.keys(val).length) {
    return true;
  }
  return false;
};

/**
 * Try to parse the given `string` as JSON. Fails
 * gracefully if the value cannot be parsed.
 *
 * @name  .tryParse
 * @param {String} `string`
 * @return {Object}
 * @api public
 */

utils.tryParse = function (str) {
  try {
    return JSON.parse(str);
  } catch (err) { }
  return null;
};

/**
 * Return the given value. If the value is a function
 * it will be called, and the result is returned.
 *
 * @param  {any} `val`
 * @return {any}
 * @api public
 */

utils.result = function (value) {
  if (typeof value === 'function') {
    return value();
  }
  return value;
};

/**
 * Return the given value, unchanged.
 *
 * @param  {any} `val`
 * @return {any}
 * @api public
 */

utils.identity = function (val) {
  return val;
};

/**
 * Return true if `val` is a string.
 *
 * @param  {any} `val` The value to check
 * @return {Boolean}
 * @api public
 */

utils.isString = function (val) {
  return val && typeof val === 'string';
};

/**
 * Cast `val` to an array.
 *
 * @param  {any} `val` The value to arrayify.
 * @return {Array}
 * @api public
 */

utils.arrayify = function (val) {
  return val ? (Array.isArray(val) ? val : [val]) : [];
};

utils.isArray = Array.isArray;

/**
 * Get the context to use for rendering.
 *
 * @param {Object} `thisArg` Optional invocation context `this`
 * @return {Object}
 * @api public
 */

utils.context = function (thisArg, locals, options) {
  if (utils.isOptions(thisArg)) {
    return utils.context({}, locals, thisArg);
  }
  // ensure args are in the correct order
  if (utils.isOptions(locals)) {
    return utils.context(thisArg, options, locals);
  }
  var appContext = utils.isApp(thisArg) ? thisArg.context : {};
  options = options || {};

  // if "options" is not handlebars options, merge it onto locals
  if (!utils.isOptions(options)) {
    locals = Object.assign({}, locals, options);
  }
  // merge handlebars root data onto locals if specified on the hash
  if (utils.isOptions(options) && options.hash.root === true) {
    locals = Object.assign({}, options.data.root, locals);
  }
  var context = Object.assign({}, appContext, locals, options.hash);
  if (!utils.isApp(thisArg)) {
    context = Object.assign({}, thisArg, context);
  }
  if (utils.isApp(thisArg) && thisArg.view && thisArg.view.data) {
    context = Object.assign({}, context, thisArg.view.data);
  }
  return context;
};

/**
 * Creates an options object from the `context`, `locals` and `options.`
 * Handlebars' `options.hash` is merged onto the options, and if the context
 * is created by [templates][], `this.options` will be merged onto the
 * options as well.
 *
 * @param {Object} `context`
 * @param {Object} `locals` Options or locals
 * @param {Object} `options`
 * @return {Boolean}
 * @api public
 */

utils.options = function (thisArg, locals, options) {
  if (utils.isOptions(thisArg)) {
    return utils.options({}, locals, thisArg);
  }
  if (utils.isOptions(locals)) {
    return utils.options(thisArg, options, locals);
  }
  options = options || {};
  if (!utils.isOptions(options)) {
    locals = Object.assign({}, locals, options);
  }
  var opts = Object.assign({}, locals, options.hash);
  if (utils.isObject(thisArg)) {
    opts = Object.assign({}, thisArg.options, opts);
  }
  if (opts[options.name]) {
    opts = Object.assign({}, opts[options.name], opts);
  }
  return opts;
};

/**
 * Returns true if an `app` propery is on the context, which means
 * the context was created by [assemble][], [templates][], [verb][],
 * or any other library that follows this convention.
 *
 * ```js
 * Handlebars.registerHelper('example', function(val, options) {
 *   var context = options.hash;
 *   if (utils.isApp(this)) {
 *     context = Object.assign({}, this.context, context);
 *   }
 *   // do stuff
 * });
 * ```
 * @param {any} `value`
 * @return {Boolean}
 * @api public
 */

utils.isApp = function (thisArg) {
  return utils.isObject(thisArg)
    && utils.isObject(thisArg.options)
    && utils.isObject(thisArg.app);
};

/**
 * Expose `utils`
 */

module.exports = utils;