var Code = require('code'),
    Lab = require('lab'),
    lab = exports.lab = Lab.script(),
    describe = lab.experiment,
    expect = Code.expect,
    it = lab.it,
    renderString = require('../spec-helpers').renderString;

describe('getShortMonth helper', function() {

    it('should render an object properly', function(done) {

        expect(renderString('{{getShortMonth 1}}')) .to.be.equal('Jan');
        expect(renderString('{{getShortMonth 2}}')) .to.be.equal('Feb');
        expect(renderString('{{getShortMonth 3}}')) .to.be.equal('Mar');
        expect(renderString('{{getShortMonth 4}}')) .to.be.equal('Apr');
        expect(renderString('{{getShortMonth 5}}')) .to.be.equal('May');
        expect(renderString('{{getShortMonth 6}}')) .to.be.equal('Jun');
        expect(renderString('{{getShortMonth 7}}')) .to.be.equal('Jul');
        expect(renderString('{{getShortMonth 8}}')) .to.be.equal('Aug');
        expect(renderString('{{getShortMonth 9}}')) .to.be.equal('Sep');
        expect(renderString('{{getShortMonth 10}}')) .to.be.equal('Oct');
        expect(renderString('{{getShortMonth 11}}')) .to.be.equal('Nov');
        expect(renderString('{{getShortMonth 12}}')) .to.be.equal('Dec');

        done();
    });
});
