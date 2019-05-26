'use strict';

const factory = globals => {
    return function(...args) {
        const options = args[args.length - 1];
        args[args.length - 1] = Object.assign({}, options, {
            fn: options.inverse || (() => false),
            inverse: options.fn || (() => true),
            hash: options.hash
        });

        return globals.handlebars.helpers['if'].apply(this, args);
    };
};

module.exports = [{
    name: 'unless',
    factory: factory,
}];
