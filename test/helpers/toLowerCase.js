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

describe('toLowerCase helper', function() {

    var context = {
        string: "I Love PIZZA",
        number: 365,
        object: {},
        array: [1, 2, 3]
    };

    it('should convert string to lower case', function(done) {

        expect(c('{{toLowerCase string}}', context))
            .to.contain('i love pizza');

        expect(c('{{toLowerCase "HELLO"}}', context))
            .to.contain('hello');

        done();
    });

    it('should properly handle values other than strings', function(done) {
        
        expect(c('{{toLowerCase number}}', context))
            .to.contain('365');

        expect(c('{{toLowerCase 5}}', context))
            .to.contain('5');

        expect(c('{{toLowerCase object}}', context))
            .to.contain('[object Object]');

        expect(c('{{toLowerCase array}}', context))
            .to.contain('1,2,3');

        done();
    });
});
