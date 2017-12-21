'use strict';

const factory = globals => {
    return function(name) {
        const options = arguments[arguments.length - 1];

        /* Look for partial by name. */
        const partial = globals.handlebars.partials[name] || options.fn;
        return partial(this, { data: options.hash });
    };
};

module.exports = [{
    name: 'block',
    factory: factory,
}];
