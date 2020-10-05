'use strict';

const factory = globals => {
    function filterValues(value) {
        let result = value;
        try {
            JSON.parse(value);
        } catch (e) {
            if (typeof value === 'string') {
                result = globals.handlebars.escapeExpression(value);
            }
            if (typeof value === 'object' && value !== null) {
                result = filterObjectValues(value);
            }
        }
        return result;
    }
    function filterObjectValues(obj) {
        let filteredObject = {};
        Object.keys(obj).forEach(key => {
            if (typeof obj[key] === 'string') {
                filteredObject[key] = globals.handlebars.escapeExpression(obj[key]);
                return;
            }
            if (typeof obj[key] === 'object' && obj[key] !== null) {
                filteredObject[key] = filterObjectValues(obj[key]);
                return;
            } else {
                filteredObject[key] = obj[key];
            }
        });
        return filteredObject;
    }

    return function(key, value) {
        if (typeof value === 'function') {
            return;
        }

        // Setup storage
        if (typeof globals.storage.inject === 'undefined') {
            globals.storage.inject = {};
        }

        // Store value for later use by jsContext
        globals.storage.inject[key] = filterValues(value);
    };
};

module.exports = [{
    name: 'inject',
    factory: factory,
}];
