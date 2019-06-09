'use strict';

const factory = globals => {
    return function(name, options) {
        /* Look for partial by name. */
        options = options ? options : name;
        const partial = globals.handlebars.partials[name] || options.fn;
        return partial(this, { data: options.hash });
    };
};

module.exports = [{
    name: 'block',
    factory: factory,
}];
