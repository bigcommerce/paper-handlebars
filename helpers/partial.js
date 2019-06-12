'use strict';

const factory = globals => {
    return function(name, options) {
        options = options ? options : name;
        globals.handlebars.registerPartial(name, options.fn);
    };
};

module.exports = [{
    name: 'partial',
    factory: factory,
}];
