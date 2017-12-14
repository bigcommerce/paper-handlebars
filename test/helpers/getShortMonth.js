var Code = require('code'),
    Lab = require('lab'),
    Paper = require('../../index'),
    lab = exports.lab = Lab.script(),
    describe = lab.experiment,
    expect = Code.expect,
    it = lab.it;

function c(template) {
    return new Paper().loadTemplatesSync({template: template}).render('template');
}

describe('getShortMonth helper', function() {

    it('should render an object properly', function(done) {

        expect(c('{{getShortMonth 1}}')) .to.be.equal('Jan');
        expect(c('{{getShortMonth 2}}')) .to.be.equal('Feb');
        expect(c('{{getShortMonth 3}}')) .to.be.equal('Mar');
        expect(c('{{getShortMonth 4}}')) .to.be.equal('Apr');
        expect(c('{{getShortMonth 5}}')) .to.be.equal('May');
        expect(c('{{getShortMonth 6}}')) .to.be.equal('Jun');
        expect(c('{{getShortMonth 7}}')) .to.be.equal('Jul');
        expect(c('{{getShortMonth 8}}')) .to.be.equal('Aug');
        expect(c('{{getShortMonth 9}}')) .to.be.equal('Sep');
        expect(c('{{getShortMonth 10}}')) .to.be.equal('Oct');
        expect(c('{{getShortMonth 11}}')) .to.be.equal('Nov');
        expect(c('{{getShortMonth 12}}')) .to.be.equal('Dec');

        done();
    });
});
