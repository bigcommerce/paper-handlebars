var Code = require('code'),
    Lab = require('lab'),
    lab = exports.lab = Lab.script(),
    describe = lab.experiment,
    expect = Code.expect,
    it = lab.it,
    renderString = require('../spec-helpers').renderString;

describe('limit helper', function() {

    it('should limit an array properly', function(done) {

        expect(renderString('{{#each (limit var 4)}}{{this}} {{/each}}', {var: [1,2,3,4,5,6,7,8]}))
            .to.be.equal('1 2 3 4 ');

        done();
    });

    it('should limit an string properly', function(done) {
        var description = "This is longer than the chosen limit";

        expect(renderString('{{limit var 10}}', {var: description}))
            .to.be.equal('This is lo');

        done();
    });
});
