'use strict';

const factory = globals => {
    return function(translationKey) {
        const options = arguments[arguments.length - 1];
        const translator = globals.getTranslator();
        if (translator) {
            const result = translator.translate(translationKey, options.hash);
            if (typeof result === 'string') {
                return result;
            }
        }
        return ''
    };
};

module.exports = [{
    name: 'lang',
    factory: factory,
}];
