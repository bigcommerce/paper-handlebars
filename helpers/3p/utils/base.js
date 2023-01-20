'use strict';

const { getValue } = require('../../lib/common');
const getObject = require('../../../helpers/getObject');

module.exports = {
    sortBy: require('./lib/arraySort'),
    filter: require('./lib/arrayFilter'),
    flatten: require('./lib/arrayFlatten'),
    iterator: require('./lib/makeIterator'),
    indexOf: require('./lib/indexOf'),
    typeOf: require('./lib/kindOf'),
    isEven: require('./lib/isEven'),
    isNumber: require('./lib/isNumber'),
    isOdd: require('./lib/isOdd'),
    createFrame: require('./lib/createFrame'),
    get: getValue,
    getObject: getObject[0].factory(),
    forOwn: require('./lib/forOwn'),
    merge: require('./lib/mixinDeep'),
};