'use strict';

const helpers = require('handlebars-helpers');

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
        name: 'html',
        // module: require('./3p/html'),
        include: ['ellipsis', 'sanitize', 'ul', 'ol', 'thumbnailImage']
    },
    {
        name: 'inflection',
        include: ['inflect', 'ordinalize'],
    },
    {
        name: 'markdown',
        include: ['markdown'],
    },
    {
        name: 'math',
        include: ['add', 'subtract', 'divide', 'multiply', 'floor', 'ceil', 'round', 'sum', 'avg'],
    },
    {
        name: 'misc',
        include: ['default', 'noop', 'withHash'],
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
        include: ['encodeURI', 'decodeURI', 'urlResolve', 'urlParse', 'stripProtocol'],
    },
];

// Construct the data structure the caller expects: an array of { name, factory }
const exportedHelpers = [];
for (let i = 0; i < whitelist.length; i++) {
    const spec = whitelist[i];

    // Initialize module
    const module = spec.module ? spec.module : helpers[spec.name]();
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
