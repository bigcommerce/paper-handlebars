var Code = require('code'),
    Lab = require('lab'),
    Renderer = require('../../index'),
    lab = exports.lab = Lab.script(),
    describe = lab.experiment,
    expect = Code.expect,
    it = lab.it;

function c(template) {
    const renderer = new Renderer();
    return renderer.renderString(template, {});
}

describe('snippet helper', function() {

    it('should render a comment', function(done) {

        expect(c('{{{snippet "header"}}}'))
            .to.be.equal('<!-- snippet location header -->');

        done();
    });
});
