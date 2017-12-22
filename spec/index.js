'use strict';

const Sinon = require('sinon');
const Code = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const expect = Code.expect;
const it = lab.it;
const describe = lab.describe;
const beforeEach = lab.beforeEach;
const afterEach = lab.afterEach;

const Handlebars = require('handlebars');
const HandlebarsRenderer = require('../index');
const capture = require('./spec-helpers').capture;

describe('switching handlebars versions', () => {
    it('defaults to v3', done => {
        const renderer = new HandlebarsRenderer();
        expect(renderer.handlebars.VERSION.substring(0, 1)).to.equal('3');
        done();
    });

    it('can load v3', done => {
        const renderer = new HandlebarsRenderer({}, {}, 'v3');
        expect(renderer.handlebars.VERSION.substring(0, 1)).to.equal('3');
        done();
    });

    it('can load v4', done => {
        const renderer = new HandlebarsRenderer({}, {}, 'v4');
        expect(renderer.handlebars.VERSION.substring(0, 1)).to.equal('4');
        done();
    });
});

describe('helper registration', () => {
    let renderer;

    beforeEach(done => {
        renderer = new HandlebarsRenderer();
        done();
    });

    it('loads the helpers and registers them with handlebars', done => {
        // Handlebars loads some default helpers, so let's find out how many
        const handlebars = Handlebars.create();
        const defaultHelpers = Object.keys(handlebars.helpers).length;
        expect(defaultHelpers).to.be.greaterThan(0);

        // We already test that the expected helpers load properly in the helpers spec,
        // so here let's just test that we register extra helpers above and beyond the defaults.
        expect(Object.keys(renderer.handlebars.helpers).length).to.be.greaterThan(defaultHelpers);
        done();
    });
});

describe('helper context', () => {
    let renderer, siteSettings, themeSettings;

    beforeEach(done => {
        renderer = new HandlebarsRenderer();
        done();
    });

    it('puts empty site settings into the helper context when not provided', done => {
        expect(renderer.helperContext.siteSettings).to.equal({});
        done();
    });

    it('puts site settings into the helper context when provided', done => {
        siteSettings = { foo: 'bar' };
        renderer = new HandlebarsRenderer(siteSettings);
        expect(renderer.helperContext.siteSettings).to.equal(siteSettings);
        done();
    });

    it('puts empty theme settings into the helper context when not provided', done => {
        expect(renderer.helperContext.themeSettings).to.equal({});
        done();
    });

    it('puts theme settings into the helper context when provided', done => {
        themeSettings = { foo: 'bar' };
        renderer = new HandlebarsRenderer({}, themeSettings);
        expect(renderer.helperContext.themeSettings).to.equal(themeSettings);
        done();
    });

    it('puts translator accessor into the helper context', done => {
        const translator = { foo: 'bar' };
        renderer.setTranslator(translator);
        expect(renderer.helperContext.getTranslator()).to.equal(translator);
        done();
    });

    it('puts page content accessor into the helper context', done => {
        const content = { foo: 'bar' };
        renderer.addContent(content);
        expect(renderer.helperContext.getContent()).to.equal(content);
        done();
    });

    it('puts handlebars environment into the helper context', done => {
        expect(renderer.helperContext.handlebars).to.not.be.undefined();
        expect(renderer.helperContext.handlebars.helpers).to.not.be.empty();
        done();
    });

    it('puts a handle to global storage into the helper context', done => {
        expect(renderer.helperContext.storage).to.not.be.undefined();
        done();
    });
});

describe('addTemplates', () => {
    let renderer, sandbox, loggerSpy;
    const templates = {
        'foo': '{{bar}}',
        'baz': '{{bat}}',
    };

    beforeEach(done => {
        sandbox = Sinon.sandbox.create();
        renderer = new HandlebarsRenderer();
        loggerSpy = Sinon.spy(renderer._logger, 'error');
        done();
    });

    afterEach(done => {
        sandbox.restore();
        done();
    });

    it('registers preprocessed templates with handlebars', done => {
        const processor = renderer.getPreProcessor();
        renderer.addTemplates(processor(templates));
        expect(renderer.handlebars.partials['foo']).to.not.be.undefined();
        expect(renderer.handlebars.partials['baz']).to.not.be.undefined();
        done();
    });

    it('registers raw templates with handlebars', done => {
        renderer.addTemplates(templates);
        expect(renderer.handlebars.partials['foo']).to.not.be.undefined();
        expect(renderer.handlebars.partials['baz']).to.not.be.undefined();
        done();
    });

    it('registers a mix of preprocessed and raw templates with handlebars', done => {
        const processor = renderer.getPreProcessor();
        const processedTemplates = processor(templates);
        renderer.addTemplates(Object.assign({}, processedTemplates, { 'bat': '{{bob}}' }));
        expect(renderer.handlebars.partials['foo']).to.not.be.undefined();
        expect(renderer.handlebars.partials['baz']).to.not.be.undefined();
        expect(renderer.handlebars.partials['bat']).to.not.be.undefined();
        done();
    });

    it('skips over precompiled templates with the wrong compiler version', done => {
        const processor = renderer.getPreProcessor();
        const processedTemplates = processor(templates);
        processedTemplates['baz'] = processedTemplates['baz'].replace(/\[6,">= 2.0.0-beta.1"\]/, '[7,">= 4.0"]');
        renderer.addTemplates(processedTemplates);
        expect(renderer.handlebars.partials['foo']).to.not.be.undefined();
        expect(renderer.handlebars.partials['baz']).to.be.undefined();
        expect(loggerSpy.called).to.equal(true);
        done();
    });

    it('preProcessor skips over bad templates', done => {
        const processor = renderer.getPreProcessor();
        const processedTemplates = processor(Object.assign({}, templates, { 'bat': '{{' }));
        renderer.addTemplates(processedTemplates);
        expect(renderer.handlebars.partials['foo']).to.not.be.undefined();
        expect(renderer.handlebars.partials['baz']).to.not.be.undefined();
        expect(renderer.handlebars.partials['bat']).to.be.undefined();
        expect(loggerSpy.called).to.equal(true);
        done();
    });

    it('can render using registered partials', done => {
        const processor = renderer.getPreProcessor();
        renderer.addTemplates(processor(templates));
        expect(renderer.render('baz', { bat: '123' })).to.equal('123');
        done();
    });

    it('isTemplateLoaded tells you if a template has been loaded', done => {
        const processor = renderer.getPreProcessor();
        renderer.addTemplates(processor(templates));
        expect(renderer.isTemplateLoaded('baz')).to.be.true();
        done();
    });

    it('does not override templates if called twice', done => {
        const newTemplates = {
          'baz': 'no variables',
        };

        const processor = renderer.getPreProcessor();
        renderer.addTemplates(processor(templates));
        renderer.addTemplates(processor(newTemplates));
        expect(renderer.render('baz', { bat: '123' })).to.equal('123');
        done();
    });
});

describe('render', () => {
    let renderer, sandbox, loggerSpy;
    const templates = {
        'foo': '{{bar}}',
        'capitalize_foo': '{{capitalize bar}}',
        'with_locale': '{{locale_name}}',
        'with_template': '{{template}}',
    };
    const context = {
        bar: 'baz'
    };

    beforeEach(done => {
        sandbox = Sinon.sandbox.create();
        renderer = new HandlebarsRenderer();
        loggerSpy = Sinon.spy(renderer._logger, 'error');
        const processor = renderer.getPreProcessor();
        renderer.addTemplates(processor(templates));
        done();
    });

    afterEach(done => {
        sandbox.restore();
        done();
    });

    it('can render using registered partials', done => {
        expect(renderer.render('foo', context)).to.equal('baz');
        done();
    });

    it('renders without a context', done => {
        expect(renderer.render('foo')).to.equal('');
        done();
    });

    it('sets the locale in the context if a translator is supplied', done => {
        const translator = {
            getLocale: () => 'en',
        };
        renderer.setTranslator(translator);
        expect(renderer.render('with_locale', context)).to.equal('en');
        done();
    });

    it('sets the template path in the context', done => {
        expect(renderer.render('with_template', context)).to.equal('with_template');
        done();
    });

    it('applies decorators', done => {
        renderer.addDecorator(output => {
            return `<wrap>${output}</wrap>`;
        });
        expect(renderer.render('foo', context)).to.equal('<wrap>baz</wrap>');
        done();
    });

    it('can use helpers', done => {
        expect(renderer.render('capitalize_foo', context)).to.equal('Baz');
        done();
    });

    it('can tolerate missing template', done => {
        expect(renderer.render('nonexistent-template', context)).to.equal('');
        expect(loggerSpy.called).to.equal(true);
        done();
    });

    it('can tolerate bad template', done => {
        renderer.addTemplates({'bad-template': '{{'});
        expect(renderer.render('bad-template', context)).to.equal('');
        expect(loggerSpy.called).to.equal(true);
        done();
    });
});

describe('renderString', () => {
    let renderer, sandbox, loggerSpy;
    const context = {
        bar: 'baz'
    };

    beforeEach(done => {
        sandbox = Sinon.sandbox.create();
        renderer = new HandlebarsRenderer();
        loggerSpy = Sinon.spy(renderer._logger, 'error');
        done();
    });

    afterEach(done => {
        sandbox.restore();
        done();
    });

    it('renders the given template with the given context', done => {
        expect(renderer.renderString('<foo>{{bar}}</foo>', context)).to.equal('<foo>baz</foo>');
        done();
    });

    it('can use helpers', done => {
        expect(renderer.renderString('<foo>{{capitalize bar}}</foo>', context)).to.equal('<foo>Baz</foo>');
        done();
    });

    it('renders without a context', done => {
        expect(renderer.renderString('foo')).to.equal('foo');
        done();
    });

    it('can tolerate bad template', done => {
        expect(renderer.renderString('{{', context)).to.equal('');
        expect(loggerSpy.called).to.equal(true);
        done();
    });
});

describe('logger', () => {
    const message = 'Great minds think alike.';
    let renderer;

    beforeEach(done => {
        renderer = new HandlebarsRenderer();
        renderer.setLogger({ 'info': m => { console.log(`message = ${m}`); } });
        done();
    });

    it('uses the given logger', done => {
        let captured = capture(() => {
            renderer.logger().info(message);
        });

        expect(captured).to.equal(`message = ${message}\n`);
        done();
    });
});
