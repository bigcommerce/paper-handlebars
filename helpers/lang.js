'use strict';

const factory = globals => {
    return function(translationKey) {
        const options = arguments[arguments.length - 1];
        const translator = globals.getTranslator();
        return translator ? translator.translate(translationKey, options.hash) : '';
    };
};

module.exports = [{
    name: 'lang',
    factory: factory,
}];
