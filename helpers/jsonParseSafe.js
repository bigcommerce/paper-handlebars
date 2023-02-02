'use strict';

function factory(globals) {
  return function (value) {
    const options = arguments[arguments.length - 1];

    try {
      return options.fn(JSON.parse(value));
    } catch (err) {
      return options.inverse(this);
    }
  };
}

module.exports = [{
  name: 'JSONparseSafe',
  factory: factory,
}];
