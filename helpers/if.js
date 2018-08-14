'use strict';

const _ = require('lodash');

const factory = globals => {
    return function(lvalue, operator, rvalue) {
        const options = arguments[arguments.length - 1];
        let result;

        function isOptions(obj) {
            return _.isObject(obj) && obj.fn;
        }

        // Only parameter
        if (isOptions(operator)) {
            // If an array is passed as the only parameter
            if (_.isArray(lvalue)) {
                result = !!lvalue.length;
            }
            // If an empty object is passed, treat as false
            else if (_.isEmpty(lvalue) && _.isObject(lvalue)) {
                result = false;
            }
            // Everything else
            else {
                result = !!lvalue;
            }
        } else {

            if (isOptions(rvalue)) {
                // @TODO: this block is for backwards compatibility with 'compare' helper
                // Remove after operator='==' is removed from stencil theme
                rvalue = operator;
                operator = options.hash.operator || "==";
            }

            switch (operator) {
            case '==':
                result = (lvalue == rvalue);
                break;

            case '===':
                result = (lvalue === rvalue);
                break;

            case '!=':
                result = (lvalue != rvalue);
                break;

            case '!==':
                result = (lvalue !== rvalue);
                break;

            case '<':
                result = (lvalue < rvalue);
                break;

            case '>':
                result = (lvalue > rvalue);
                break;

            case '<=':
                result = (lvalue <= rvalue);
                break;

            case '>=':
                result = (lvalue >= rvalue);
                break;

            case 'gtnum':  
                if ((typeof lvalue === 'string') && (typeof(rvalue) === 'string') && (!isNaN(lvalue)) && (!isNaN(rvalue))) {
                    result = (parseInt(lvalue) > parseInt(rvalue));
                    break;
                } else {
                    throw new Error("Handlerbars Helper if gtnum accepts ONLY valid number string");
                }
            case 'typeof':
                result = (typeof lvalue === rvalue);
                break;

            default:
                throw new Error("Handlerbars Helper 'if' doesn't know the operator " + operator);
            }
        }

        if (!options.fn || !options.inverse) {
            options.fn = () => true;
            options.inverse = () => false;
        }

        if (result) {
            return options.fn(this);
        } else {
            return options.inverse(this);
        }
    };
};

module.exports = [{
    name: 'if',
    factory: factory,
}];
