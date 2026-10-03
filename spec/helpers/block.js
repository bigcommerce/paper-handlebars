const Code = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const describe = lab.experiment;
const expect = Code.expect;
const it = lab.it;
const { render } = require('../spec-helpers');

describe('partial and block helpers', function () {
    it('should insert partial into the corresponding block', function (done) {
        var templates = {
                template: '{{#partial "page"}}<h1>{{title}}</h1><p>{{content}}</p>{{/partial}}{{> layout}}',
                layout: '<html><body>{{#block "page"}}{{/block}}</body>/<html>',
            },
            context = {
                title: 'Hello',
                content: 'World',
            };

        render('template', context, {}, {}, templates).then(result => {
            expect(result).to.contain('<html><body><h1>Hello</h1><p>World</p></body>/<html>');
            done();
        });
    });

    it('should not trigger an error if partial name is empty, fallback case used instead', function (done) {
        var templates = {
            template: '{{#partial }}World{{/partial}}{{> layout}}',
            layout: 'Hello{{#block "page"}} Brave New World{{/block}}',
        };

        render('template', {}, {}, {}, templates).then(result => {
            expect(result).to.be.equal('Hello Brave New World');
            done();
        });
    });

    it('should not trigger an error if block name is empty', function (done) {
        var templates = {
            template: '{{#partial "page" "2134"}}World{{/partial}}{{> layout}}',
            layout: 'Hello{{#block}}{{/block}}',
        };

        render('template', {}, {}, {}, templates).then(result => {
            expect(result).to.be.equal('Hello');
            done();
        });
    });

    it('should successfully render template', function (done) {
        const templateContent = "some-content";
        const templates = {
            "layout/base": templateContent,
            template: `{{#JSONparse '{"layout/base":{}}'}}{{#partial this}}{{/partial}}{{/JSONparse}}{{>layout/base}}`,
        };
        render('template', {}, {}, {}, templates).then(result => {
            expect(result).to.be.equal(templateContent);
            done();
        });
    });

    it('should successfully render template with context', function (done) {
        const templateContent = "Hello, world!";
        const templates = {
            template: `{{#partial "base"}}Hello, world!{{/partial}}{{#partial notPartials}}{{/partial}}{{> base}}`,
        };
        const context  = {
            notPartials: {
                "base": {}
            }
        }
        render('template', context, {}, {}, templates).then(result => {
            expect(result).to.be.equal(templateContent);
            done();
        });
    });

    it('should expose `@root` inside a partial rendered into a block', function (done) {
        const templates = {
            template: '{{#partial "page"}}<h1>{{@root.title}}</h1>{{/partial}}{{> layout}}',
            layout: '{{#with nested}}{{#block "page"}}{{/block}}{{/with}}',
        };

        render('template', { title: 'Hello', nested: {} }, {}, {}, templates).then(result => {
            expect(result).to.equal('<h1>Hello</h1>');
            done();
        });
    });

    it('should expose `@root` inside the fallback content of a block', function (done) {
        const templates = {
            template: '{{#block "missing"}}{{@root.title}}{{/block}}',
        };

        render('template', { title: 'Hello' }, {}, {}, templates).then(result => {
            expect(result).to.equal('Hello');
            done();
        });
    });

    it('should expose block hash arguments as private variables alongside `@root`', function (done) {
        const templates = {
            template: '{{#partial "page"}}{{@greeting}} {{@root.title}}{{/partial}}{{> layout}}',
            layout: '{{#block "page" greeting="Hi"}}{{/block}}',
        };

        render('template', { title: 'Hello' }, {}, {}, templates).then(result => {
            expect(result).to.equal('Hi Hello');
            done();
        });
    });

    it('should not forward enclosing private variables other than `@root`, but allow `@../` scope shifts', function (done) {
        const templates = {
            template: '{{#partial "page"}}<{{@index}}{{@../index}}{{@root.title}}>{{/partial}}{{> layout}}',
            layout: '{{#each items}}{{#block "page"}}{{/block}}{{/each}}',
        };

        render('template', { title: 'Hello', items: [1, 2] }, {}, {}, templates).then(result => {
            expect(result).to.equal('<0Hello><1Hello>');
            done();
        });
    });

    it('should return empty string if using a reserved object property name', function (done) {
        const templates = {
            template: '{{#partial "__proto__"}}Page partial content.{{/partial}}{{> layout}}',
            layout: '{{#block "constructor"}}{{/block}}',
        };

        const context = {};

        render('template', context, {}, {}, templates).then(result => {
            expect(result).to.equal('');
            done();
        });
    });
});

describe('block / partial @ variable boundary', function () {
    // pierces: reaches the block body across the helper boundary.
    // blocked: must NOT reach the block body directly.
    // gotcha:  documented behaviour that may surprise.
    // l{n}:    loop marker, one per iteration, each iteration ends with a single space;
    //          nested loops list each level outer-first (l0x1:).
    const { renderString } = require('../spec-helpers');
    const boundaryContext = {
        title: 'T',
        nested: { title: 'N' },
        outer: [1, 2],
        outerObj: { k1: 1, k2: 2 },
        arr: [{ n: 'a' }, { n: 'b' }],
    };
    const boundaryCases = [
        { desc: 'pierces: @root into a #partial body rendered by #block',
          input: '{{#partial "p"}}{{@root.title}}{{/partial}}{{#with nested}}{{#block "p"}}{{/block}}{{/with}}', output: 'T' },
        { desc: 'pierces: @root into #block fallback content',
          input: '{{#with nested}}{{#block "none"}}{{@root.title}}{{/block}}{{/with}}', output: 'T' },
        { desc: 'pierces: @root through a block helper nested inside #block',
          input: '{{#block "o"}}{{#forEach @root.arr}}l{{@index}}:{{@root.title}} {{/forEach}}{{/block}}', output: 'l0:T l1:T ' },
        { desc: 'pierces: #block hash args as private variables',
          input: '{{#partial "p"}}{{@greeting}}{{/partial}}{{#block "p" greeting="Hi"}}{{/block}}', output: 'Hi' },
        { desc: 'pierces: @../index scope shift to the #each around the #block call site',
          input: '{{#partial "p"}}l{{@../index}}:{{@../index}} {{/partial}}{{#each outer}}{{#block "p"}}{{/block}}{{/each}}', output: 'l0:0 l1:1 ' },
        { desc: 'pierces: @../abc scope shift to an enclosing #block hash var',
          input: '{{#block "o" abc="x"}}{{#block "i"}}[{{@abc}}|{{@../abc}}]{{/block}}{{/block}}', output: '[|x]' },
        { desc: 'blocked: enclosing @index / @key / @first',
          input: '{{#partial "p"}}l{{@../key}}:[{{@index}}{{@key}}{{@first}}] {{/partial}}{{#each outerObj}}{{#block "p"}}{{/block}}{{/each}}',
          output: 'lk1:[] lk2:[] ' },
        { desc: 'blocked: options internals (@data, @fn, @hash)',
          input: '{{#block "none" foo="y"}}[{{@data.root.title}}{{@fn}}{{@hash.foo}}]{{/block}}', output: '[]' },
        { desc: 'blocked: #block hash args do not leak out after the block',
          input: '{{#block "none" foo="y"}}{{/block}}[{{@foo}}]', output: '[]' },
        { desc: 'blocked: a #block hash arg does not overwrite the enclosing #each @index',
          input: '{{#each outer}}l{{@index}}:{{#block "none" index="Z"}}{{/block}}{{@index}} {{/each}}', output: 'l0:0 l1:1 ' },
        { desc: 'gotcha: a hash arg named root shadows @root',
          input: '{{#block "none" root="X"}}{{@root}}{{/block}}', output: 'X' },
    ];

    ['v3', 'v4'].forEach(hbVersion => {
        boundaryCases.forEach(({ desc, input, output }) => {
            it(`${hbVersion} ${desc}`, function(done) {
                renderString(input, boundaryContext, {}, {}, undefined, hbVersion).then(result => {
                    expect(result).to.equal(output);
                    done();
                }).catch(done);
            });
        });
    });
});
