'use strict';

const _ = require('lodash');

const factory = globals => {
    /**
     * @deprecate
     */
    return function() {
        return _.pick.apply(null, arguments);
    };
};

module.exports = [{
    name: 'pick',
    factory: factory,
}];
