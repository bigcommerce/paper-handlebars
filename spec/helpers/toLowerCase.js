var Code = require('code'),
    Lab = require('lab'),
    lab = exports.lab = Lab.script(),
    describe = lab.experiment,
    expect = Code.expect,
    it = lab.it,
    renderString = require('../spec-helpers').renderString;

describe('toLowerCase helper', function() {

    var context = {
        string: "I Love PIZZA",
        number: 365,
        object: {},
        array: [1, 2, 3]
    };

    it('should convert string to lower case', function(done) {

        expect(renderString('{{toLowerCase string}}', context))
            .to.contain('i love pizza');

        expect(renderString('{{toLowerCase "HELLO"}}', context))
            .to.contain('hello');

        done();
    });

    it('should properly handle values other than strings', function(done) {
        
        expect(renderString('{{toLowerCase number}}', context))
            .to.contain('365');

        expect(renderString('{{toLowerCase 5}}', context))
            .to.contain('5');

        expect(renderString('{{toLowerCase object}}', context))
            .to.contain('[object Object]');

        expect(renderString('{{toLowerCase array}}', context))
            .to.contain('1,2,3');

        done();
    });
});
