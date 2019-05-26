'use strict';

const factory = globals => {
    return function(name, ...args) {
        const options = args.length ? args[args.length - 1] : name;

        /* Look for partial by name. */
        const partial = globals.handlebars.partials[name] || options.fn;
        return partial(this, { data: options.hash });
    };
};

module.exports = [{
    name: 'block',
    factory: factory,
}];
