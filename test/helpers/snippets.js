var Code = require('code'),
    Lab = require('lab'),
    Paper = require('../../index'),
    lab = exports.lab = Lab.script(),
    describe = lab.experiment,
    expect = Code.expect,
    it = lab.it;

function c(template) {
    return new Paper().loadTemplatesSync({template: template}).render('template', {});
}

describe('snippet helper', function() {

    it('should render a comment', function(done) {

        expect(c('{{{snippet "header"}}}'))
            .to.be.equal('<!-- snippet location header -->');

        done();
    });
});
