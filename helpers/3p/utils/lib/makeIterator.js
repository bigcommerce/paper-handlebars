/*!
 * COPY of https://raw.githubusercontent.com/jonschlinkert/make-iterator/0.3.0/index.js
 */
const typeOf = require('./kindOf');
const deepMatches = require('./deepMatches');

module.exports = function makeIterator(target, thisArg) {
  switch (typeOf(target)) {
    case 'undefined':
    case 'null':
      return noop;
    case 'function':
      // function is the first to improve perf (most common case)
      // also avoid using `Function#call` if not needed, which boosts
      // perf a lot in some cases
      return (typeof thisArg !== 'undefined') ? function(val, i, arr) {
        return target.call(thisArg, val, i, arr);
      } : target;
    case 'object':
      return function(val) {
        return deepMatches(val, target);
      };
    case 'regexp':
      return function(str) {
        return target.test(str);
      };
    case 'string':
    case 'number':
    default: {
      return prop(target);
    }
  }
};


function prop(name) {
  return function(obj) {
    return obj[name];
  };
}

function noop(val) {
  return val;
}