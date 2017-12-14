'use strict';

var _ = require('lodash');

function helper(paper) {
    paper.handlebars.registerHelper('for', function (from, to, context) {
        const options = arguments[arguments.length - 1];
        const maxIterations = 100;
        var output = '';

        function isOptions(obj) {
            return _.isObject(obj) && obj.fn;
        }

        if (isOptions(to)) {
            context = {};
            to = from;
            from = 1;

        } else if (isOptions(context)) {
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

        for (var i = from; i <= to; i++) {
            context.$index = i;
            output += options.fn(context);
        }

        return output;
    });
}

module.exports = helper;
