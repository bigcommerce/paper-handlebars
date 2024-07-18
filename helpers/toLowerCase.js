'use strict';

const factory = () => {
    return function(...args) {
        args.pop();
        const string = args[0];
        if (typeof string !== 'string') {
            return string;
        }

        return string.toLowerCase();
    };
};

module.exports = [{
    name: 'toLowerCase',
    factory: factory,
}];
