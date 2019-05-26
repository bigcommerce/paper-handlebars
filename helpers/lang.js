'use strict';

const factory = globals => {
    return function(translationKey, ...args) {
        const options = args[args.length - 1];
        const translator = globals.getTranslator();
        return translator ? translator.translate(translationKey, options.hash) : '';
    };
};

module.exports = [{
    name: 'lang',
    factory: factory,
}];
