'use strict';

const _ = require('lodash');

const factory = () => {
    /**
     * @deprecate
     */
    return function(...args) {
        return _.pick.apply(null, args);
    };
};

module.exports = [{
    name: 'pick',
    factory: factory,
}];
