'use strict';

const factory = globals => {
    return function() {
        const options = arguments[arguments.length - 1];
        arguments[arguments.length - 1] = Object.assign({}, options, {
            fn: options.inverse || (() => false),
            inverse: options.fn || (() => true),
            hash: options.hash
        });

        return globals.handlebars.helpers['if'].apply(this, arguments);
    };
};

module.exports = [{
    name: 'unless',
    factory: factory,
}];
