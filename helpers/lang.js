'use strict';

const factory = globals => {
    return function(translationKey, options) {
        const translator = globals.getTranslator();
        return translator ? translator.translate(translationKey, options.hash) : '';
    };
};

module.exports = [{
    name: 'lang',
    factory: factory,
}];
