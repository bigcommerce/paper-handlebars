var Code = require('code'),
    Lab = require('lab'),
    Paper = require('../index'),
    lab = exports.lab = Lab.script(),
    describe = lab.experiment,
    expect = Code.expect,
    it = lab.it;

describe('loadTheme()', function() {
    var assembler = {
        getTemplates: function(path, processor, callback) {
            process.nextTick(function() {
                var templates = {
                    'pages/product': '<html></html>',
                    'pages/partial': '<p></p>',
                    'pages/localeName': '{{locale_name}}',
                };

                callback(null, processor(templates));
            });
        },
        getTranslations: function (callback) {
            process.nextTick(function() {
                var translations = {
                    'en': {
                        hello: 'Hello {name}',
                        level1: {
                            level2: 'we are in the second level'
                        }
                    },
                    'fr': {
                        hello: 'Bonjour {name}',
                        level1: {
                            level2: 'nous sommes dans le deuxième niveau'
                        }
                    },
                    'fr-CA': {
                        hello: 'Salut {name}'
                    }
                };

                callback(null, translations);
            });
        }
    };

    it('should use the assembler interface to load templates and translations', done => {
        const paper = new Paper(null, null, assembler);

        paper.loadTheme('pages/product', 'fr-CA;q=0.8, fr, en', () => {
            expect(paper.handlebars.templates['pages/product']).to.be.a.function();
            expect(paper.handlebars.templates['pages/partial']).to.be.a.function();
            expect(paper.translator.translate('hello', {name: 'Mario'})).to.be.equal('Bonjour Mario');
            expect(paper.translator.translate('hello', {name: 'Already Compiled'})).to.be.equal('Bonjour Already Compiled');
            expect(paper.translator.translate('does_not_exist')).to.be.equal('does_not_exist');

            done();
        });
    });

    it('should get the localeName from the acceptLanguage header', done => {
        const paper = new Paper(null, null, assembler);

        paper.loadTheme('pages/localeName', 'fr-CA;q=0.8, fr, en', () => {
            expect(paper.translator.getLocale()).to.be.equal('fr');

            done();
        });
    });

    it('should default to english if the locale is not supported', done => {
        const paper = new Paper(null, null, assembler);

        paper.loadTheme('pages/localeName', 'es-VE, en', () => {
            expect(paper.translator.getLocale()).to.be.equal('en');

            done();
        });
    });

    it('should include the langName in the template context', done => {
        const paper = new Paper(null, null, assembler);

        paper.loadTheme('pages/localeName', 'fr-CA, en', () => {
            expect(paper.render('pages/localeName', {})).to.be.equal('fr-CA');

            done();
        });
    });
});

describe('cdnify()', function () {
    it('should not include session id', function (done) {
        var paper = new Paper({
            cdn_url: 'http://cdn.example.com/foo',
            theme_version_id: '123',
        });

        expect(paper.cdnify('/assets/image.jpg'))
            .to.be.equal('http://cdn.example.com/foo/stencil/123/image.jpg');

        done();
    });

    it('should use sessionId if available', function (done) {
        var paper = new Paper({
            cdn_url: 'http://cdn.example.com/foo',
            theme_version_id: '123',
            theme_session_id: '345',
        });

        expect(paper.cdnify('/assets/image.jpg'))
            .to.be.equal('http://cdn.example.com/foo/stencil/123/e/345/image.jpg');

        done();
    });
});

describe('render()', function() {
    var templates = {
            'pages/product': '<html>{{> pages/partial}}</html>',
            'pages/partial': '<p>{{variable}}</p>',
            'pages/greet': '<h1>{{lang \'good\'}} {{lang \'morning\'}}</h1>',
            'pages/pre': '{{{pre object}}}',
        },
        context = {
            variable: 'hello world',
            object: {}
        };

    it('should render pages/product', function(done) {
        var compiled = new Paper().loadTemplatesSync(templates).render('pages/product', context);
        expect(compiled).to.be.equal('<html><p>hello world</p></html>');
        done();
    });

    it('should render pages/partial', function(done) {
        var compiled = new Paper().loadTemplatesSync(templates).render('pages/partial', context);
        expect(compiled).to.be.equal('<p>hello world</p>');
        done();
    });

    it('should render with errors', function(done) {
        var templates = {
            'errorPage': '{{'
        };

        try {
            var compiled = new Paper().loadTemplatesSync(templates).render('errorPage', context);
            expect(compiled).not.to.exist();
        } catch (ex) {
            expect(ex).to.exist();
        }

        done();
    });
});
