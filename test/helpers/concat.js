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

describe('concat helper', function() {

    it('should concatanate two strings', function(done) {

        expect(c('{{concat var1 var2}}', {var1: 'hello', var2: 'world'}))
            .to.be.equal('helloworld');

        done();
    });
});

