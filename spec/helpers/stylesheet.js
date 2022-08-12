const _ = require('lodash');
const Lab = require('lab'),
    lab = exports.lab = Lab.script(),
    describe = lab.experiment,
    it = lab.it;
const {buildRenderer, testRunner} = require("../spec-helpers");
const {expect} = require("code");
const resourceHintStyleType = require("../../helpers/lib/resourceHints").resourceHintAllowedTypes.resourceHintStyleType;

describe('stylesheet helper', () => {
    const siteSettings = {
        cdn_url: 'https://cdn.bcapp/hash',
        theme_version_id: '123',
        theme_config_id: 'xyz',
    };

    const runTestCases = testRunner({siteSettings});

    it('should render a link tag with the cdn ulr and stencil-stylesheet data tag', done => {

        const template = '{{{stylesheet "assets/css/style.css" resourceHint="preload"}}}';
        const expected = '<link data-stencil-stylesheet href="https://cdn.bcapp/hash/stencil/123/css/style-xyz.css" rel="stylesheet">';

        const renderer = buildRenderer(siteSettings);
        renderer.renderString(template, {})
            .then(r => {
                expect(r).to.equals(expected);

                const hints = renderer.getResourceHints();
                expect(hints.length).to.equals(1);

                _.each(hints, function ({src, state, type}) {
                    expect(src).to.startWith(siteSettings.cdn_url);
                    expect(type).to.equals(resourceHintStyleType);
                    expect(state).to.equals('preload');
                });

                done();
            })
            .catch(done);
    });

    it('should render a link tag and all extra attributes with no cdn url', done => {
        runTestCases([
            {
                input: '{{{stylesheet "assets/css/style.css" blah rel="something" class="myStyle"}}}',
                output: '<link data-stencil-stylesheet href="/assets/css/style.css" rel="something" class="myStyle">',
                siteSettings: {},
            },
        ], done);
    });

    it('should render a link with empty href and no resource hint', done => {
        const template = '{{{stylesheet "" }}}';

        const renderer = buildRenderer(siteSettings);
        renderer.renderString(template, {})
            .then(r => {
                expect(r).to.equals('<link data-stencil-stylesheet href="" rel="stylesheet">');
                const hints = renderer.getResourceHints();
                expect(hints).to.have.length(0);
                done();
            })
            .catch(done);
    });

    it('should add configId to the filename', done => {
        const template = '{{{stylesheet "assets/css/style.css" resourceHint="preconnect" }}}';
        const src = '/assets/css/style-foo.css';
        const output = `<link data-stencil-stylesheet href="${src}" rel="stylesheet">`;

        const handlebarsRenderer = buildRenderer({theme_config_id: 'foo'});
        handlebarsRenderer.renderString(template, {})
            .then(r => {
                expect(r).to.equals(output);
                const hint = _.head(handlebarsRenderer.getResourceHints());
                expect(hint.src).to.equals(src);
                expect(hint.state).to.equals('preconnect');

                done();
            })
            .catch(done);
    });

    it('should not append configId if the file is not in assets/css/ directory', done => {
        runTestCases([
            {
                input: '{{{stylesheet "assets/lib/style.css" }}}',
                output: '<link data-stencil-stylesheet href="/assets/lib/style.css" rel="stylesheet">',
                siteSettings: { theme_config_id: 'foo' },
            },
        ], done);
    });
});
