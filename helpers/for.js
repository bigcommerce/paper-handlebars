'use strict';

const utils = require('handlebars-utils');

const factory = () => {
    return function(from, to, context) {
        const options = arguments[arguments.length - 1];
        const maxIterations = 100;
        var output = '';

        if (utils.isOptions(to)) {
            context = {};
            to = from;
            from = 1;

        } else if (utils.isOptions(context)) {
            if (utils.isObject(to)) {
                context = to;
                to = from;
                from = 1;
            }
        }

        if (to < from) {
            return;
        }

        from = parseInt(from, 10);
        to = parseInt(to, 10);

        if ((to - from) >= maxIterations) {
            to = from + maxIterations - 1;
        }

        for (var i = from; i <= to; i++) {
            context.$index = i;
            output += options.fn(context);
        }

        return output;
    };
};

module.exports = [{
    name: 'for',
    factory: factory,
}];
