var Code = require('code'),
    Lab = require('lab'),
    lab = exports.lab = Lab.script(),
    describe = lab.experiment,
    expect = Code.expect,
    it = lab.it,
    renderString = require('../spec-helpers').renderString;

describe('snippet helper', function() {

    it('should render a comment', function(done) {

        expect(renderString('{{{snippet "header"}}}'))
            .to.be.equal('<!-- snippet location header -->');

        done();
    });
});
