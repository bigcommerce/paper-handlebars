'use strict';

/**
 * @deprecate Use {{#for start end (context)}}...{{/for}}
 */
const factory = () => {
    return function(start, end) {
        const options = arguments[arguments.length - 1];
        var out = '';
        var i = start;

        for (i; i <= end; i++) {
            out = out + options.fn(i);
        }

        return out + '';
    };
};

module.exports = [{
    name: 'enumerate',
    factory: factory,
}];
