'use strict';

function helper(paper) {
    paper.handlebars.registerHelper('block', function (name) {
        const options = arguments[arguments.length - 1];

        /* Look for partial by name. */
        var partial = paper.handlebars.partials[name] || options.fn;
        return partial(this, {data: options.hash});
    });

    paper.handlebars.registerHelper('partial', function (name) {
        var options = arguments[arguments.length - 1];

        paper.handlebars.registerPartial(name, options.fn);
    });
}

module.exports = helper;
