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

describe('for helper', function() {

    var context = {name: 'Joe'};

    it('should itarate 10 times', function(done) {

        expect(c('{{#for 10 this}}{{$index}}:{{name}} {{/for}}', context))
            .to.contain('1:Joe 2:Joe 3:Joe 4:Joe 5:Joe 6:Joe 7:Joe 8:Joe 9:Joe 10:Joe');

        expect(c('{{#for 1 10 this}}{{$index}}:{{name}} {{/for}}', context))
            .to.contain('1:Joe 2:Joe 3:Joe 4:Joe 5:Joe 6:Joe 7:Joe 8:Joe 9:Joe 10:Joe');

        expect(c('{{#for 0 9 this}}{{$index}}:{{name}} {{/for}}', context))
            .to.contain('0:Joe 1:Joe 2:Joe 3:Joe 4:Joe 5:Joe 6:Joe 7:Joe 8:Joe 9:Joe');

        expect(c('{{#for 1000 1010 this}}{{$index}}:{{name}} {{/for}}', context))
            .to.contain('1000:Joe 1001:Joe 1002:Joe 1003:Joe 1004:Joe 1005:Joe 1006:Joe 1007:Joe 1008:Joe 1009:Joe');

        done();
    });

    it('should not itarate more than 100 times', function(done) {

        expect(c('{{#for 0 99}}x{{/for}}', context).length)
            .to.be.equal(100);

        expect(c('{{#for 1 100}}x{{/for}}', context).length)
            .to.be.equal(100);
            
        expect(c('{{#for 0 3000 this}}.{{/for}}', context).length)
            .to.be.equal(100);

        expect(c('{{#for 2015 3000}}.{{/for}}', context).length)
            .to.be.equal(100);

        done();
    });

    it('should render w/o context', function(done) {

        expect(c('{{#for 10}}{{$index}} {{/for}}', context))
            .to.be.equal('1 2 3 4 5 6 7 8 9 10 ');

        expect(c('{{#for 1 10}}{{$index}} {{/for}}', context))
            .to.be.equal('1 2 3 4 5 6 7 8 9 10 ');

        expect(c('{{#for 0 9}}{{$index}} {{/for}}', context))
            .to.be.equal('0 1 2 3 4 5 6 7 8 9 ');

        expect(c('{{#for 0 20}}.{{/for}}', context))
            .to.be.equal('.....................');

        expect(c('{{#for 0 99}}{{/for}}', context))
            .to.be.equal('');

        done();
    });


    it('should convert strings to integers and iterate 10 times', function(done) {
        var context = {
            start: '1',
            end: '10'
        }

        expect(c('{{#for start end}}{{$index}} {{/for}}', context))
            .to.be.equal('1 2 3 4 5 6 7 8 9 10 ');
        done();
    });

    it('should not iterate if "from" is less than "to"', function(done) {
        var context = {
            start: 10,
            end: 1
        }

        expect(c('{{#for start end}}{{$index}} {{/for}}', context))
            .to.be.equal('');
        done();
    });
});
