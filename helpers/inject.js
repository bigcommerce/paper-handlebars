'use strict';

const factory = globals => {
    return function(key, value) {
        if (typeof value === 'function') {
            return;
        }

        // Setup storage
        if (typeof globals.storage.inject === 'undefined') {
            globals.storage.inject = {};
        }

        // Store value for later use by jsContext
        globals.storage.inject[key] = value;
    };
};

module.exports = [{
    name: 'inject',
    factory: factory,
}];
