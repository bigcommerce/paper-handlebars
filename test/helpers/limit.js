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

describe('limit helper', function() {

    it('should limit an array properly', function(done) {

        expect(c('{{#each (limit var 4)}}{{this}} {{/each}}', {var: [1,2,3,4,5,6,7,8]}))
            .to.be.equal('1 2 3 4 ');

        done();
    });

    it('should limit an string properly', function(done) {
        var description = "This is longer than the chosen limit";

        expect(c('{{limit var 10}}', {var: description}))
            .to.be.equal('This is lo');

        done();
    });
});
