'use strict';

/**
 * @deprecate Use {{#if val1 '==' val2}}...{{/if}}
 */
const factory = () => {
    return function(val1, val2) {
        const options = arguments[arguments.length - 1];

        if (val1 != val2) {
            return '';
        }

        return options.fn();
    };
};

module.exports = [{
    name: 'equals',
    factory: factory,
}];
