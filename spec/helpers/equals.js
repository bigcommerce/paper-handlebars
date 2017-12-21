var Code = require('code'),
    Lab = require('lab'),
    lab = exports.lab = Lab.script(),
    describe = lab.experiment,
    expect = Code.expect,
    it = lab.it,
    renderString = require('../spec-helpers').renderString;

describe('equals helper', function() {
    var context = {
        value: 5
    };

    it('should render yes if the value is equal to 5', function(done) {

        expect(renderString('{{#equals 5 value}}yes{{/equals}}', context))
            .to.be.equal('yes');

        expect(renderString('{{#equals value 5}}yes{{/equals}}', context))
            .to.be.equal('yes');

        done();
    });

    it('should render empty string', function(done) {

        expect(renderString('{{#equals 6 value}}yes{{/equals}}', context))
            .to.be.equal('');

        expect(renderString('{{#equals value 6}}yes{{/equals}}', context))
            .to.be.equal('');

        done();
    });
});
