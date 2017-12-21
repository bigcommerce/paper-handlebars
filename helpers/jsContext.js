'use strict';

// Used in conjunction with 'inject'
const factory = globals => {
    return function() {
        const jsContext = JSON.stringify(JSON.stringify(globals.storage.inject || {})); // TODO: why double stringify??
        return new globals.handlebars.SafeString(jsContext);
    };
};

module.exports = [{
    name: 'jsContext',
    factory: factory,
}];
