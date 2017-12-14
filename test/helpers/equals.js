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

describe('equals helper', function() {
    var context = {
        value: 5
    };

    it('should render yes if the value is equal to 5', function(done) {

        expect(c('{{#equals 5 value}}yes{{/equals}}', context))
            .to.be.equal('yes');

        expect(c('{{#equals value 5}}yes{{/equals}}', context))
            .to.be.equal('yes');

        done();
    });

    it('should render empty string', function(done) {

        expect(c('{{#equals 6 value}}yes{{/equals}}', context))
            .to.be.equal('');

        expect(c('{{#equals value 6}}yes{{/equals}}', context))
            .to.be.equal('');

        done();
    });
});
