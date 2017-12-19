'use strict';

const factory = globals => {
    return function(string) {
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
