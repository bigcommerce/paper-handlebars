'use strict';

var isObject = require('./object').isObject;
var isString = require('./string').isString;
var utils = require('./utils');

/**
 * Expose `helpers`
 */

var helpers = module.exports;

/**
 * Block helper that renders the block if **both** of the given values
 * are truthy. If an inverse block is specified it will be rendered
 * when falsy.
 *
 * @param {any} `a`
 * @param {any} `b`
 * @return {String}
 * @block
 * @api public
 */

helpers.and = function(a, b) {
  const options = arguments[arguments.length - 1];
  if (a && b) {
    return options.fn(this);
  }
  return options.inverse(this);
};

/**
 * Block helper that renders a block if `a` is **greater than** `b`.
 *
 * If an inverse block is specified it will be rendered when falsy.
 * You may optionally use the `compare=""` hash argument for the
 * second value.
 *
 * @name .gt
 * @param {String} `a`
 * @param {String} `b`
 * @return {String} Block, or inverse block if specified and falsey.
 * @block
 * @api public
 */

helpers.gt = function(a, b) {
  const options = arguments[arguments.length - 1];
  if (arguments.length === 2) {
    b = options.hash.compare;
  }
  if (a > b) {
    return options.fn(this);
  }
  return options.inverse(this);
};

/**
 * Block helper that renders a block if `a` is **greater than or
 * equal to** `b`.
 *
 * If an inverse block is specified it will be rendered when falsy.
 * You may optionally use the `compare=""` hash argument for the
 * second value.
 *
 * @name .gte
 * @param {String} `a`
 * @param {String} `b`
 * @return {String} Block, or inverse block if specified and falsey.
 * @block
 * @api public
 */

helpers.gte = function(a, b) {
  const options = arguments[arguments.length - 1];
  if (arguments.length === 2) {
    b = options.hash.compare;
  }
  if (a >= b) {
    return options.fn(this);
  }
  return options.inverse(this);
};

/**
 * Block helper that renders a block if `value` has `pattern`.
 * If an inverse block is specified it will be rendered when falsy.
 *
 * @param {any} `val` The value to check.
 * @param {any} `pattern` The pattern to check for.
 * @return {String}
 * @block
 * @api public
 */

helpers.has = function(value, pattern) {
  const options = arguments[arguments.length - 1];
  if (arguments.length === 2) {
    return pattern.inverse(this);
  }

  if (arguments.length === 1) {
    return value.inverse(this);
  }

  if ((Array.isArray(value) || isString(value)) && isString(pattern)) {
    if (value.indexOf(pattern) > -1) {
      return options.fn(this);
    }
  }
  if (isObject(value) && isString(pattern) && pattern in value) {
    return options.fn(this);
  }
  return options.inverse(this);
};

/**
 * Block helper that renders a block if `a` is **equal to** `b`.
 * If an inverse block is specified it will be rendered when falsy.
 * You may optionally use the `compare=""` hash argument for the
 * second value.
 *
 * @name .eq
 * @param {String} `a`
 * @param {String} `b`
 * @return {String} Block, or inverse block if specified and falsey.
 * @block
 * @api public
 */

helpers.eq = function(a, b) {
  const options = arguments[arguments.length - 1];
  if (arguments.length === 2) {
    b = options.hash.compare;
  }
  if (a === b) {
    return options.fn(this);
  }
  return options.inverse(this);
};

/**
 * Return true if the given value is an even number.
 *
 * ```handlebars
 * {{#ifEven value}}
 *   render A
 * {{else}}
 *   render B
 * {{/ifEven}}
 * ```
 * @param  {Number} `number`
 * @return {String} Block, or inverse block if specified and falsey.
 * @block
 * @api public
 */

helpers.ifEven = function(num) {
  const options = arguments[arguments.length - 1];
  return utils.isEven(num)
    ? options.fn(this)
    : options.inverse(this);
};

/**
 * Conditionally renders a block if the remainder is zero when
 * `a` operand is divided by `b`. If an inverse block is specified
 * it will be rendered when the remainder is **not zero**.
 *
 * @param {Number}
 * @param {Number}
 * @return {String} Block, or inverse block if specified and falsey.
 * @block
 * @api public
 */

helpers.ifNth = function(a, b) {
  const options = arguments[arguments.length - 1];
  if (utils.isNumber(a) && utils.isNumber(b) && b % a === 0) {
    return options.fn(this);
  }
  return options.inverse(this);
};

/**
 * Block helper that renders a block if `value` is **an odd number**.
 * If an inverse block is specified it will be rendered when falsy.
 *
 * ```handlebars
 * {{#ifOdd value}}
 *   render A
 * {{else}}
 *   render B
 * {{/ifOdd}}
 * ```
 * @param  {Object} `value`
 * @return {String} Block, or inverse block if specified and falsey.
 * @block
 * @api public
 */

helpers.ifOdd = function(val) {
  const options = arguments[arguments.length - 1];
  return utils.isOdd(val)
    ? options.fn(this)
    : options.inverse(this);
};

/**
 * Block helper that renders a block if `a` is **equal to** `b`.
 * If an inverse block is specified it will be rendered when falsy.
 *
 * @name .is
 * @param {any} `a`
 * @param {any} `b`
 * @return {String}
 * @block
 * @api public
 */

helpers.is = function(a, b) {
  const options = arguments[arguments.length - 1];
  if (arguments.length === 2) {
    b = options.hash.compare;
  }
  if (a === b) {
    return options.fn(this);
  }
  return options.inverse(this);
};

/**
 * Block helper that renders a block if `a` is **not equal to** `b`.
 * If an inverse block is specified it will be rendered when falsy.
 *
 * @name .isnt
 * @param {String} `a`
 * @param {String} `b`
 * @return {String}
 * @block
 * @api public
 */

helpers.isnt = function(a, b) {
  const options = arguments[arguments.length - 1];
  if (arguments.length === 2) {
    b = options.hash.compare;
  }
  if (a !== b) {
    return options.fn(this);
  }
  return options.inverse(this);
};

/**
 * Block helper that renders a block if `a` is **less than** `b`.
 *
 * If an inverse block is specified it will be rendered when falsy.
 * You may optionally use the `compare=""` hash argument for the
 * second value.
 *
 * @name .lt
 * @param {Object} `context`
 * @return {String} Block, or inverse block if specified and falsey.
 * @block
 * @api public
 */

helpers.lt = function(a, b) {
  const options = arguments[arguments.length - 1];
  if (arguments.length === 2) {
    b = options.hash.compare;
  }
  if (a < b) {
    return options.fn(this);
  }
  return options.inverse(this);
};

/**
 * Block helper that renders a block if `a` is **less than or
 * equal to** `b`.
 *
 * If an inverse block is specified it will be rendered when falsy.
 * You may optionally use the `compare=""` hash argument for the
 * second value.
 *
 * @name .lte
 * @param {Sring} `a`
 * @param {Sring} `b`
 * @return {String} Block, or inverse block if specified and falsey.
 * @block
 * @api public
 */

helpers.lte = function(a, b) {
  const options = arguments[arguments.length - 1];
  if (arguments.length === 2) {
    b = options.hash.compare;
  }
  if (a <= b) {
    return options.fn(this);
  }
  return options.inverse(this);
};

/**
 * Block helper that renders a block if **neither of** the given values
 * are truthy. If an inverse block is specified it will be rendered
 * when falsy.
 *
 * @name .neither
 * @param {any} `a`
 * @param {any} `b`
 * @return {String} Block, or inverse block if specified and falsey.
 * @block
 * @api public
 */

helpers.neither = function(a, b) {
  const options = arguments[arguments.length - 1];
  if (!a && !b) {
    return options.fn(this);
  }
  return options.inverse(this);
};


/**
 * Block helper that always renders the inverse block **unless `a` is
 * is equal to `b`**.
 *
 * @name .unlessEq
 * @param {String} `a`
 * @param {String} `b`
 * @return {String} Inverse block by default, or block if falsey.
 * @block
 * @api public
 */

helpers.unlessEq = function(context) {
  const options = arguments[arguments.length - 1];
  if (context === options.hash.compare) {
    return options.inverse(this);
  }
  return options.fn(this);
};

/**
 * Block helper that always renders the inverse block **unless `a` is
 * is greater than `b`**.
 *
 * @name .unlessGt
 * @param {Object} `context`
 * @return {String} Inverse block by default, or block if falsey.
 * @block
 * @api public
 */

helpers.unlessGt = function(context) {
  const options = arguments[arguments.length - 1];
  if (context > options.hash.compare) {
    return options.inverse(this);
  }
  return options.fn(this);
};

/**
 * Block helper that always renders the inverse block **unless `a` is
 * is less than `b`**.
 *
 * @name .unlessLt
 * @param {Object} `context`
 * @return {String} Block, or inverse block if specified and falsey.
 * @block
 * @api public
 */

helpers.unlessLt = function(context) {
  const options = arguments[arguments.length - 1];
  if (context < options.hash.compare) {
    return options.inverse(this);
  }
  return options.fn(this);
};

/**
 * Block helper that always renders the inverse block **unless `a` is
 * is greater than or equal to `b`**.
 *
 * @name .unlessGteq
 * @param {Object} `context`
 * @return {String} Block, or inverse block if specified and falsey.
 * @block
 * @api public
 */

helpers.unlessGteq = function(context) {
  const options = arguments[arguments.length - 1];
  if (context >= options.hash.compare) {
    return options.inverse(this);
  }
  return options.fn(this);
};

/**
 * Block helper that always renders the inverse block **unless `a` is
 * is less than or equal to `b`**.
 *
 * @name .unlessLteq
 * @param {Object} `context`
 * @return {String} Block, or inverse block if specified and falsey.
 * @block
 * @api public
 */

helpers.unlessLteq = function(context) {
  const options = arguments[arguments.length - 1];
  if (context <= options.hash.compare) {
    return options.inverse(this);
  }
  return options.fn(this);
};