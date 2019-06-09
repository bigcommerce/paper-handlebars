'use strict';

const factory = () => {
    return function(lvalue, rvalue, options) {
        if (typeof options === 'undefined') {
            throw new Error("Handlerbars Helper 'compare' needs 2 parameters and a block.");
        }

        const operator = options.hash.operator || "==";

        const operators = {
            '==': function (l, r) { return l == r; },
            '===': function (l, r) { return l === r; },
            '!=': function (l, r) { return l != r; },
            '!==': function (l, r) { return l !== r; },
            '<': function (l, r) { return l < r; },
            '>': function (l, r) { return l > r; },
            '<=': function (l, r) { return l <= r; },
            '>=': function (l, r) { return l >= r; },
            'typeof': function (l, r) { return typeof l == r; }
        };

        // getOwnPropertyNames is used because checking the property
        // directly (like operators[x]) is insecure
        // (we could use switch instead)
        if (Object.getOwnPropertyNames(operators).indexOf(operator) === -1) {
            throw new Error("Handlerbars Helper 'compare' doesn't know the operator " + operator);
        }

        const result = operators[operator](lvalue, rvalue);

        if (result) {
            return options.fn(this);
        } else {
            return options.inverse(this);
        }
    };
};

module.exports = [{
    name: 'compare',
    factory: factory,
}];
