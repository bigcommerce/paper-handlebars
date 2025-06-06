'use strict';

const Code = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const expect = Code.expect;
const it = lab.it;
const describe = lab.describe;
const beforeEach = lab.beforeEach;

describe('helper registration', () => {
    let helpers;

    beforeEach(done => {
        helpers = require('../helpers');
        done();
    });

    it('loads all the helpers', done => {
        const expectedHelpers = [
            'all',
            'any',
            'assignVar',
            'block',
            'cdn',
            'compare',
            'concat',
            'contains',
            'decrementVar',
            'dynamicComponent',
            'encodeHtmlEntities',
            'for',
            'get',
            'getContentImage',
            'getContentImageSrcset',
            'getFontLoaderConfig',
            'getFontsCollection',
            'getImage',
            'getImageManagerImage',
            'getImageManagerImageSrcset',
            'getImageSrcset',
            'getImageSrcset1x2x',
            'getObject',
            'getVar',
            'helperMissing',
            'if',
            'incrementVar',
            'inject',
            'join',
            'jsContext',
            'json',
            'lang',
            'langJson',
            'limit',
            'moment',
            'money',
            'multiConcat',
            'nl2br',
            'occurrences',
            'option',
            'or',
            'partial',
            'pluck',
            'pre',
            'region',
            'replace',
            'resourceHints',
            'setURLQueryParam',
            'snippet',
            'stripQuerystring',
            'strReplace',
            'stylesheet',
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
            'isEmpty',
            'iterate',
            'length',
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
            'ellipsis',
            'sanitize',
            'ul',
            'ol',
            'thumbnailImage',
            'inflect',
            'ordinalize',
            'markdown',
            'add',
            'subtract',
            'divide',
            'multiply',
            'floor',
            'ceil',
            'round',
            'sum',
            'avg',
            'default',
            'noop',
            'withHash',
            'addCommas',
            'phoneNumber',
            'random',
            'toAbbr',
            'toExponential',
            'toFixed',
            'toFloat',
            'toInt',
            'toPrecision',
            'extend',
            'forIn',
            'forOwn',
            'toPath',
            'hasOwn',
            'isObject',
            'merge',
            'JSONparseSafe',
            'JSONparse',
            'JSONstringify',
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
            'uppercase',
            'encodeURI',
            'decodeURI',
            'urlResolve',
            'urlParse',
            'stripProtocol',
            'toLowerCase',
            'truncate',
            'unless',
            'enumerate',
            'equals',
            'getShortMonth',
            'pick',
            'earlyHint',
            'nonce',
            'typeof'
        ].sort();

        expect(helpers.map(helper => helper.name).sort()).to.be.equal(expectedHelpers);
        done();
    });
});
