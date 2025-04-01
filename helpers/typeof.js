'use strict';
const common = require('./lib/common.js');

const factory = globals => {
      return function(data) {
            arguments.pop(); // remove Options
            if (arguments.length !== 1) {
                throw new ValidationError("Handlebars helper 'typeof' requires exactly one argument.");
            }
            data = common.unwrapIfSafeString(globals.handlebars, data);
        return typeof data;
    };
};

module.exports = [{
    name: 'typeof',
    factory: factory,
}];
