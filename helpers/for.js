'use strict';

const common = require('./lib/common.js');

const factory = () => {
    return function(from, to, context, options) {
        const maxIterations = 100;
        let output = '';

        if (common.isOptions(to)) {
            options = to;
            context = {};
            to = from;
            from = 1;

        } else if (common.isOptions(context)) {
            options = context;
            if (common.isObject(to)) {
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

        for (let i = from; i <= to; i++) {
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