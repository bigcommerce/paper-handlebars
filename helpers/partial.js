'use strict';

const factory = globals => {
    return function(name) {
        const options = arguments[arguments.length - 1];
        globals.handlebars.registerPartial(name, options.fn);
    };
};

module.exports = [{
    name: 'partial',
    factory: factory,
}];
