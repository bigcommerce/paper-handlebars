/**
 * 
 * https://github.com/jonschlinkert/create-frame/blob/master/index.js
 * https://github.com/jonschlinkert/define-property/blob/master/index.js
 */


const { ValidationError } = require('../../../../lib/errors');

function extend(obj /* , ...source */) {
  for (var i = 1; i < arguments.length; i++) {
    for (var key in arguments[i]) {
      if (Object.prototype.hasOwnProperty.call(arguments[i], key)) {
        obj[key] = arguments[i][key];
      }
    }
  }

  return obj;
}

function defineProperty(obj, prop, val) {
  if (typeof obj !== 'object' && typeof obj !== 'function') {
    throw new ValidationError('expected an object or function.');
  }

  if (typeof prop !== 'string') {
    throw new ValidationError('expected `prop` to be a string.');
  }


  return Object.defineProperty(obj, prop, {
    configurable: true,
    enumerable: false,
    writable: true,
    value: val
  });
};

module.exports = function createFrame(data) {
  if (typeof data !== 'object') {
    throw new ValidationError('createFrame expects data to be an object');
  }

  var frame = extend({}, data);
  frame._parent = data;

  defineProperty(frame, 'extend', function (data) {
    extend(this, data);
  });

  if (arguments.length > 1) {
    var args = [].slice.call(arguments, 1);
    var len = args.length, i = -1;
    while (++i < len) {
      frame.extend(args[i] || {});
    }
  }
  return frame;
};