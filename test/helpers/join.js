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

describe('join helper', function() {
    var context = {
        list: ['Mario', 'Chris', 'Mick', 'Hau', 'Cody']

    };

    it('should print a list of names', function(done) {

        expect(c('{{join list " "}}', context))
            .to.be.equal('Mario Chris Mick Hau Cody');

        expect(c('{{join list ", "}}', context))
            .to.be.equal('Mario, Chris, Mick, Hau, Cody');

        done();
    });

    it('should print a list of names and limit to 3', function(done) {
        expect(c('{{join list " " limit=3}}', context))
            .to.be.equal('Mario Chris Mick');

        done();
    });

    it('should print a list of names and use "and" for the last name', function(done) {
        expect(c('{{join list ", " lastSeparator=" and "}}', context))
            .to.be.equal('Mario, Chris, Mick, Hau and Cody');

        done();
    });

    it('should print a list of names and limit to 3 and use "and" for the last name', function(done) {
        expect(c('{{join list ", " limit=3 lastSeparator=" and "}}', context))
            .to.be.equal('Mario, Chris and Mick');

        done();
    });
});
