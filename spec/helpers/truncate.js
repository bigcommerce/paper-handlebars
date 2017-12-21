var Code = require('code'),
    Lab = require('lab'),
    lab = exports.lab = Lab.script(),
    describe = lab.experiment,
    expect = Code.expect,
    it = lab.it,
    renderString = require('../spec-helpers').renderString;

describe('truncate helper', function() {

    var context = {
        chinese_string: '𠜎𠜱𠝹𠱓𠱸𠲖𠳏',
        number: 2,
        spanish_string: 'mañana',
        string: 'hello world',
        unicode_string: 'She ❤️️ this',
    };

    it('should return the entire string if length is longer than the input string', function(done) {

        expect(renderString('{{truncate string 15}}', context))
            .to.be.equal('hello world');
        done();
    });

    it('should return the first length number of characters', function(done) {

        expect(renderString('{{truncate string 5}}', context))
            .to.be.equal('hello');
        done();
    });

    it('should return the first argument, coerced to a string, if it is not a string', function(done) {

        expect(renderString('{{truncate number 5}}', context))
            .to.be.equal('2');
        done();
    });

    it('should handle non-English strings', function(done) {

        expect(renderString('{{truncate spanish_string 3}}', context))
            .to.be.equal('mañ');

        expect(renderString('{{truncate chinese_string 3}}', context))
            .to.be.equal('𠜎𠜱𠝹');

        done();
    });

    it('should handle unicode strings', function(done) {

        expect(renderString('{{truncate unicode_string 5}}', context))
            .to.be.equal('She ❤️');

        done();
    });
});
