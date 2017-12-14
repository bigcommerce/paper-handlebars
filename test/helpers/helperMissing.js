var Code = require('code'),
    Lab = require('lab'),
    Paper = require('../../index'),
    lab = exports.lab = Lab.script(),
    describe = lab.experiment,
    expect = Code.expect,
    it = lab.it;

function c(template, context) {
    return new Paper().loadTemplatesSync({template: template}).render('template', context);
}

describe('helperMissing', function() {

    it('should return empty string if the helper is missing', function(done) {

        expect(c('{{thisHelperDoesNotExist}}', {}))
            .to.be.equal('');

        done();
    });
});
