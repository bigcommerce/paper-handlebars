var Code = require('code'),
    Lab = require('lab'),
    lab = exports.lab = Lab.script(),
    describe = lab.experiment,
    expect = Code.expect,
    it = lab.it,
    renderString = require('../spec-helpers').renderString;

describe('concat helper', function() {

    it('should concatanate two strings', function(done) {

        expect(renderString('{{concat var1 var2}}', {var1: 'hello', var2: 'world'}))
            .to.be.equal('helloworld');

        done();
    });
});

