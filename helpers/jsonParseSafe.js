'use strict';

function factory(globals) {
  return function (value) {
    const options = arguments[arguments.length - 1];

    try {
      if (options.fn) {
        return options.fn(JSON.parse(value));
      }
      return JSON.parse(value);
    } catch (err) {
      if (options.fn) { // If function block {{#JSONparseSafe "{}"}} escape here on excaption.
        return options.inverse(this);
      }
      return {}; // Escape hatch to avoid crash due to inline malformed JSON input.
    }
  };
}

module.exports = [{
  name: 'JSONparseSafe',
  factory: factory,
}];
