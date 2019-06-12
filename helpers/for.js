'use strict';

const _ = require('lodash');

const factory = () => {
    return function(from, to, context, options) {
        const maxIterations = 100;
        let output = '';

        function isOptions(obj) {
            return _.isObject(obj) && obj.fn;
        }

        if (isOptions(to)) {
            options = to;
            context = {};
            to = from;
            from = 1;

        } else if (isOptions(context)) {
            options = context;
            if (_.isObject(to)) {
                context = to;
                to = from;
                from = 1;
            }
        }

        if (to <= from) {
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
