'use strict';

const factory = () => {
    return function() {
        return undefined;
    };
};

module.exports = [{
    name: 'helperMissing',
    factory: factory,
}];
