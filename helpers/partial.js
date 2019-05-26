'use strict';

const factory = globals => {
    return function(name, ...args) {
        const options = args.length ? args[args.length - 1] : name;
        globals.handlebars.registerPartial(name, options.fn);
    };
};

module.exports = [{
    name: 'partial',
    factory: factory,
}];
