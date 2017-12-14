var Code = require('code'),
    Lab = require('lab'),
    Paper = require('../../index'),
    lab = exports.lab = Lab.script(),
    describe = lab.experiment,
    expect = Code.expect,
    it = lab.it;

function c(template, settings) {
    return new Paper(settings).loadTemplatesSync({ template }).render('template', {});
}

describe('stylesheet helper', () => {
    var settings = {
        cdn_url: 'https://cdn.bcapp/hash',
        theme_version_id: '123',
        theme_config_id: 'xyz',
    };
    it('should render a link tag with the cdn ulr and stencil-stylesheet data tag', done => {
        expect(c('{{{stylesheet "assets/css/style.css"}}}', settings))
            .to.be.equal('<link data-stencil-stylesheet href="https://cdn.bcapp/hash/stencil/123/css/style-xyz.css" rel="stylesheet">');

        done();
    });

    it('should render a link tag and all extra attributes with no cdn url', done => {
        expect(c('{{{stylesheet "assets/css/style.css" fuck rel="something" class="myStyle"}}}', {}))
            .to.be.equal('<link data-stencil-stylesheet href="/assets/css/style.css" rel="something" class="myStyle">');

        done();
    });

    it('should render a link with empty href', done => {
        expect(c('{{{stylesheet "" }}}'))
            .to.be.equal('<link data-stencil-stylesheet href="" rel="stylesheet">');

        done();
    });

    it('should add configId to the filename', done => {
        expect(c('{{{stylesheet "assets/css/style.css" }}}', { theme_config_id: 'foo' }))
            .to.be.equal('<link data-stencil-stylesheet href="/assets/css/style-foo.css" rel="stylesheet">');

        done();
    });

    it('should not append configId if the file is not in assets/css/ directory', done => {
        expect(c('{{{stylesheet "assets/lib/style.css" }}}', { theme_config_id: 'foo' }))
            .to.be.equal('<link data-stencil-stylesheet href="/assets/lib/style.css" rel="stylesheet">');

        done();
    });
});
