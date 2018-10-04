const Lab = require('lab'),
      lab = exports.lab = Lab.script(),
      describe = lab.experiment,
      it = lab.it,
      testRunner = require('../spec-helpers').testRunner;

describe('truncate helper', function() {
    const context = {
        chinese_string: '𠜎𠜱𠝹𠱓𠱸𠲖𠳏',
        number: 2,
        spanish_string: 'mañana',
        string: 'hello world',
        unicode_string: 'She ❤️️ this',
    };

    const runTestCases = testRunner({context});

    it('should return the entire string if length is longer than the input string', function(done) {
        runTestCases([
            {
                input: '{{truncate string 15}}',
                output: 'hello world',
            },
        ], done);
    });

    it('should return the first length number of characters', function(done) {
        runTestCases([
            {
                input: '{{truncate string 5}}',
                output: 'hello',
            },
        ], done);
    });

    it('should return the first argument, coerced to a string, if it is not a string', function(done) {
        runTestCases([
            {
                input: '{{truncate number 5}}',
                output: '2',
            },
        ], done);
    });

    it('should handle non-English strings', function(done) {
        runTestCases([
            {
                input: '{{truncate spanish_string 3}}',
                output: 'mañ',
            },
            {
                input: '{{truncate chinese_string 3}}',
                output: '𠜎𠜱𠝹',
            },
        ], done);
    });

    it('should handle unicode strings', function(done) {
        runTestCases([
            {
                input: '{{truncate unicode_string 5}}',
                output: 'She ❤️',
            },
        ], done);
    });
});
