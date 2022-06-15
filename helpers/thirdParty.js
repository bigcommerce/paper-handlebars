'use strict';

const whitelist = [
    {
        name: 'array',
        module: require('./3p/array'),
        include: [
            'after',
            'arrayify',
            'before',
            'eachIndex',
            'filter',
            'first',
            'forEach',
            'inArray',
            'isArray',
            'last',
            'lengthEqual',
            'map',
            'some',
            'sort',
            'sortBy',
            'withAfter',
            'withBefore',
            'withFirst',
            'withLast',
            'withSort',
        ],
    },
    {
        name: 'collection',
        module: require('./3p/collection'),
        include: ['isEmpty', 'iterate', 'length'],
    },
    {
        name: 'comparison',
        module: require('./3p/comparison'),
        include: [
            'and',
            'gt',
            'gte',
            'has',
            'eq',
            'ifEven',
            'ifNth',
            'ifOdd',
            'is',
            'isnt',
            'lt',
            'lte',
            'neither',
            'unlessEq',
            'unlessGt',
            'unlessLt',
            'unlessGteq',
            'unlessLteq',
        ],
    },
    {
        name: 'date',
        module: require('./3p/date'),
        include: ['moment'],
        init: () => {
            // date-helper uses moment under the hood, so we can hook in to supress
            // error messages that are not actionable
            const moment = require('moment');
            moment.suppressDeprecationWarnings = true;
        },
    },
    {
        name: 'html',
        module: require('./3p/html'),
        include: ['ellipsis', 'sanitize', 'ul', 'ol', 'thumbnailImage']
    },
    {
        name: 'inflection',
        module: require('./3p/inflection'),
        include: ['inflect', 'ordinalize'],
    },
    // FIXME: requires fs 
    // {
    //     name: 'markdown',
    //     module: require('./3p/markdown'),
    //     include: ['markdown'],
    // },
    {
        name: 'math',
        module: require('./3p/math'),
        include: ['add', 'subtract', 'divide', 'multiply', 'floor', 'ceil', 'round', 'sum', 'avg'],
    },
    {
        name: 'misc',
        module: require('./3p/misc'),
        include: ['default', 'option', 'noop', 'withHash'],
    },
    {
        name: 'number',
        module: require('./3p/number'),
        include: [
            'addCommas',
            'phoneNumber',
            'random',
            'toAbbr',
            'toExponential',
            'toFixed',
            'toFloat',
            'toInt',
            'toPrecision',
        ],
    },
    {
        name: 'object',
        module: require('./3p/object'),
        include: [
            'extend',
            'forIn',
            'forOwn',
            'toPath',
            'get',
            'getObject',
            'hasOwn',
            'isObject',
            'merge',
            'JSONparse',
            'JSONstringify',
        ],
    },
    {
        name: 'string',
        module: require('./3p/string'),
        include: [
            'camelcase',
            'capitalize',
            'capitalizeAll',
            'center',
            'chop',
            'dashcase',
            'dotcase',
            'hyphenate',
            'isString',
            'lowercase',
            'pascalcase',
            'pathcase',
            'plusify',
            'reverse',
            'sentence',
            'snakecase',
            'split',
            'startsWith',
            'titleize',
            'trim',
            'uppercase'
        ],
    },
    {
        name: 'url',
        module: require('./3p/url'),
        include: ['encodeURI', 'decodeURI', 'urlResolve', 'urlParse', 'stripProtocol'],
    },
];

// Construct the data structure the caller expects: an array of { name, factory }
const exportedHelpers = [];
for (let i = 0; i < whitelist.length; i++) {
    const spec = whitelist[i];

    // Initialize module
    const module = spec.module;
    if (typeof spec.init === 'function') {
        spec.init(module);
    }

    // Pluck whitelisted functions from each helper module and wrap in object of expected format
    const moduleWhitelist = spec.include;
    for (let i = 0; i < moduleWhitelist.length; i++) {
        const name = moduleWhitelist[i];
        exportedHelpers.push({
            name: name,
            factory: () => module[name],
        });
    }
}

module.exports = exportedHelpers;
