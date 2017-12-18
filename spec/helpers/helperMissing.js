var Code = require('code'),
    Lab = require('lab'),
    Renderer = require('../../index'),
    lab = exports.lab = Lab.script(),
    describe = lab.experiment,
    expect = Code.expect,
    it = lab.it;

function c(template, context) {
    const renderer = new Renderer();
    return renderer.renderString(template, context);
}

describe('helperMissing', function() {

    it('should return empty string if the helper is missing', function(done) {

        expect(c('{{thisHelperDoesNotExist}}', {}))
            .to.be.equal('');

        done();
    });
});
