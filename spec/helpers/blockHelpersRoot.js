const Code = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const describe = lab.experiment;
const expect = Code.expect;
const it = lab.it;
const { buildRenderer, renderString } = require('../spec-helpers');

// Every registered block helper must let `@root` pierce into its block body.
// Each template is rendered inside `{{#with nested}}`, so `@root.title` ('T')
// can't be confused with the current context's `title` ('N').
// Looping helpers prefix each render with `l{n}:` (n = that iteration's index/key/item)
// and end each render with a single space, so repeated output reads as one chunk per
// iteration (e.g. `l0:[T] l1:[T] `). ol/ul get no space: their items are already split
// by `</li><li>`.
// Known exception (not a block helper, so not covered here): `dynamicComponent`,
// where `@root` is the current item. See the comment in helpers/dynamicComponent.js.
describe('@root inside every block helper', function () {
    const B = '[{{@root.title}}]';
    const context = {
        title: 'T',
        nested: { title: 'N' },
        arr: [{ n: 'a' }, { n: 'b' }],
        arr2: ['a', 'b'],
        obj: { a: 1 },
        json: '{"a":1}',
        empty: [],
        isString: v => typeof v === 'string',
    };

    const cases = {
        JSONparse: { input: `{{#JSONparse @root.json}}${B}{{/JSONparse}}`, output: '[T]' },
        JSONparseSafe: { input: `{{#JSONparseSafe @root.json}}${B}{{/JSONparseSafe}}`, output: '[T]' },
        all: { input: `{{#all true true}}${B}{{/all}}`, output: '[T]' },
        and: { input: `{{#and true true}}${B}{{/and}}`, output: '[T]' },
        any: { input: `{{#any true}}${B}{{/any}}`, output: '[T]' },
        block: { input: `{{#block "none"}}${B}{{/block}}`, output: '[T]' },
        blockHelperMissing: { input: `{{#title}}${B}{{/title}}`, output: '[T]' },
        compare: { input: `{{#compare 1 1 operator="=="}}${B}{{/compare}}`, output: '[T]' },
        contains: { input: `{{#contains @root.arr2 "a"}}${B}{{/contains}}`, output: '[T]' },
        each: { input: `{{#each @root.arr}}l{{@index}}:${B} {{/each}}`, output: 'l0:[T] l1:[T] ' },
        eachIndex: { input: `{{#eachIndex @root.arr}}l{{index}}:${B} {{/eachIndex}}`, output: 'l0:[T] l1:[T] ' },
        enumerate: { input: `{{#enumerate 1 2}}l{{this}}:${B} {{/enumerate}}`, output: 'l1:[T] l2:[T] ' },
        eq: { input: `{{#eq 1 1}}${B}{{/eq}}`, output: '[T]' },
        equals: { input: `{{#equals 1 1}}${B}{{/equals}}`, output: '[T]' },
        filter: { input: `{{#filter @root.arr2 "a"}}${B}{{/filter}}`, output: '[T]' },
        for: { input: `{{#for 1 2}}l{{$index}}:${B} {{/for}}`, output: 'l1:[T] l2:[T] ' },
        forEach: { input: `{{#forEach @root.arr}}l{{@index}}:${B} {{/forEach}}`, output: 'l0:[T] l1:[T] ' },
        forIn: { input: `{{#forIn @root.obj}}${B}{{/forIn}}`, output: '[T]' },
        forOwn: { input: `{{#forOwn @root.obj}}${B}{{/forOwn}}`, output: '[T]' },
        get: { input: `{{#get "nested" @root}}${B}{{/get}}`, output: '[T]' },
        gt: { input: `{{#gt 2 1}}${B}{{/gt}}`, output: '[T]' },
        gte: { input: `{{#gte 2 1}}${B}{{/gte}}`, output: '[T]' },
        has: { input: `{{#has "abc" "b"}}${B}{{/has}}`, output: '[T]' },
        if: { input: `{{#if true}}${B}{{/if}}`, output: '[T]' },
        ifEven: { input: `{{#ifEven 2}}${B}{{/ifEven}}`, output: '[T]' },
        ifNth: { input: `{{#ifNth 2 4}}${B}{{/ifNth}}`, output: '[T]' },
        ifOdd: { input: `{{#ifOdd 1}}${B}{{/ifOdd}}`, output: '[T]' },
        inArray: { input: `{{#inArray @root.arr2 "a"}}${B}{{/inArray}}`, output: '[T]' },
        is: { input: `{{#is 1 1}}${B}{{/is}}`, output: '[T]' },
        isEmpty: { input: `{{#isEmpty @root.empty}}${B}{{/isEmpty}}`, output: '[T]' },
        isnt: { input: `{{#isnt 1 2}}${B}{{/isnt}}`, output: '[T]' },
        iterate: { input: `{{#iterate @root.arr}}l{{@index}}:${B} {{/iterate}}`, output: 'l0:[T] l1:[T] ' },
        lengthEqual: { input: `{{#lengthEqual @root.arr2 2}}${B}{{/lengthEqual}}`, output: '[T]' },
        lt: { input: `{{#lt 1 2}}${B}{{/lt}}`, output: '[T]' },
        lte: { input: `{{#lte 1 2}}${B}{{/lte}}`, output: '[T]' },
        markdown: { input: `{{#markdown}}${B}{{/markdown}}`, output: '<p>[T]</p>\n' },
        neither: { input: `{{#neither false false}}${B}{{/neither}}`, output: '[T]' },
        noop: { input: `{{#noop}}${B}{{/noop}}`, output: '[T]' },
        ol: { input: `{{#ol @root.arr}}l{{n}}:${B}{{/ol}}`, output: '<ol ><li>la:[T]</li>\n<li>lb:[T]</li></ol>' },
        or: { input: `{{#or true}}${B}{{/or}}`, output: '[T]' },
        partial: { input: `{{#partial "p"}}${B}{{/partial}}{{{block "p"}}}`, output: '[T]' },
        replace: { input: `{{#replace "a" "abc"}}${B}{{/replace}}`, output: '[T]bc' },
        some: { input: `{{#some @root.arr2 @root.isString}}${B}{{/some}}`, output: '[T]' },
        startsWith: { input: `{{#startsWith "a" "abc"}}${B}{{/startsWith}}`, output: '[T]' },
        ul: { input: `{{#ul @root.arr}}l{{n}}:${B}{{/ul}}`, output: '<ul ><li>la:[T]</li>\n<li>lb:[T]</li></ul>' },
        unless: { input: `{{#unless false}}${B}{{/unless}}`, output: '[T]' },
        unlessEq: { input: `{{#unlessEq 1 2}}${B}{{/unlessEq}}`, output: '[T]' },
        unlessGt: { input: `{{#unlessGt 1 2}}${B}{{/unlessGt}}`, output: '[T]' },
        unlessGteq: { input: `{{#unlessGteq 1 2}}${B}{{/unlessGteq}}`, output: '[T]' },
        unlessLt: { input: `{{#unlessLt 2 1}}${B}{{/unlessLt}}`, output: '[T]' },
        unlessLteq: { input: `{{#unlessLteq 2 1}}${B}{{/unlessLteq}}`, output: '[T]' },
        uppercase: { input: `{{#uppercase}}${B}{{/uppercase}}`, output: '[T]' },
        with: { input: `{{#with @root.nested}}${B}{{/with}}`, output: '[T]' },
        withAfter: { input: `{{#withAfter @root.arr2 0}}l{{this}}:${B} {{/withAfter}}`, output: 'la:[T] lb:[T] ' },
        withBefore: { input: `{{#withBefore @root.arr2 1}}${B}{{/withBefore}}`, output: '[T]' },
        withFirst: { input: `{{#withFirst @root.arr2}}${B}{{/withFirst}}`, output: '[T]' },
        withHash: { input: `{{#withHash a=1}}${B}{{/withHash}}`, output: '[T]' },
        withLast: { input: `{{#withLast @root.arr2}}${B}{{/withLast}}`, output: '[T]' },
        withSort: { input: `{{#withSort @root.arr2}}l{{this}}:${B} {{/withSort}}`, output: 'la:[T] lb:[T] ' },
    };

    // Helpers whose source looks block-ish to the guard below but are not block helpers.
    const notBlockHelpers = ['typeof'];

    it('has a case for every registered block helper', function (done) {
        const helpers = buildRenderer().handlebars.helpers;
        const blockish = /\.fn\(|\.inverse\(|utils?\.value\(|isBlock|options\.fn|\.fn\b/;
        const missing = Object.keys(helpers)
            .filter(name => blockish.test(helpers[name].toString()))
            .filter(name => !notBlockHelpers.includes(name) && !cases[name]);

        expect(missing).to.equal([]);
        done();
    });

    ['v3', 'v4'].forEach(hbVersion => {
        Object.keys(cases).forEach(name => {
            it(`${hbVersion} ${name}`, function (done) {
                const { input, output } = cases[name];
                renderString(`{{#with nested}}${input}{{/with}}`, context, {}, {}, undefined, hbVersion).then(result => {
                    expect(result).to.equal(output);
                    done();
                }).catch(done);
            });
        });
    });
});
