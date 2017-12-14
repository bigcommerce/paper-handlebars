'use strict';

const _ = require('lodash');
const helpers = require('handlebars-helpers');
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
        name: 'date',
        include: ['moment'],
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
        include: ['default', 'option', 'noop', 'withHash'],
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
            'occurrences',
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
        include: ['encodeURI', 'decodeURI', 'urlResolve', 'urlParse', 'stripQuerystring', 'stripProtocol'],
    },
];

function helper(paper) {
    whitelist.forEach(helper => paper.handlebars.registerHelper(_.pick(helpers[helper.name](), helper.include)));
}

module.exports = helper;
