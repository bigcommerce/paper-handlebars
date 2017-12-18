'use strict';

const factory = globals => {
    return function() {
        return undefined;
    };
};

module.exports = [{
    name: 'helperMissing',
    factory: factory,
}];
