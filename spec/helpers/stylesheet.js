const Lab = require('lab'),
      lab = exports.lab = Lab.script(),
      describe = lab.experiment,
      it = lab.it,
      testRunner = require('../spec-helpers').testRunner;

describe('stylesheet helper', () => {
    const siteSettings = {
        cdn_url: 'https://cdn.bcapp/hash',
        theme_version_id: '123',
        theme_config_id: 'xyz',
    };

    const runTestCases = testRunner({siteSettings});

    it('should render a link tag with the cdn ulr and stencil-stylesheet data tag', done => {
        runTestCases([
            {
                input: '{{{stylesheet "assets/css/style.css"}}}',
                output: '<link data-stencil-stylesheet href="https://cdn.bcapp/hash/stencil/123/css/style-xyz.css" rel="stylesheet">',
            },
        ], done);
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

    it('should render a link with empty href', done => {
        runTestCases([
            {
                input: '{{{stylesheet "" }}}',
                output: '<link data-stencil-stylesheet href="" rel="stylesheet">',
            },
        ], done);
    });

    it('should add configId to the filename', done => {
        runTestCases([
            {
                input: '{{{stylesheet "assets/css/style.css" }}}',
                output: '<link data-stencil-stylesheet href="/assets/css/style-foo.css" rel="stylesheet">',
                siteSettings: { theme_config_id: 'foo' },
            },
        ], done);
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
