'use strict';

const factory = globals => {
    return function(keyFilter) {
        const translator = globals.getTranslator();
        const langJson = translator ? translator.getLanguage(keyFilter) : {};
        return JSON.stringify(langJson);
    };
};

module.exports = [{
    name: 'langJson',
    factory: factory,
}];
