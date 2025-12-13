'use strict';

const thirdPartyHelpers = {
    array: require('./3p/array'),
    collection: require('./3p/collection'),
    comparison: require('./3p/comparison'),
    html: require('./3p/html'),
    inflection: require('./3p/inflection'),
    markdown: require('./3p/markdown'),
    math: require('./3p/math'),
    misc: require('./3p/misc'),
    number: require('./3p/number'),
    object: require('./3p/object'),
    string: require('./3p/string'),
    url: require('./3p/url'),
};

const whitelist = [
    {
        name: 'array',
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
        include: ['isEmpty', 'iterate', 'length'],
    },
    {
        name: 'comparison',
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
    const module = thirdPartyHelpers[spec.name];

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
