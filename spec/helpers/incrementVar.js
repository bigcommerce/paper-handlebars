const Lab = require('lab'),
    lab = exports.lab = Lab.script(),
    describe = lab.experiment,
    it = lab.it,
    specHelpers = require('../spec-helpers'),
    testRunner = specHelpers.testRunner,
    renderString = specHelpers.renderString;


describe('incrementVar helper', function() {
    const context = {
        value1: 12
    };

    const runTestCases = testRunner({context});

    it('should throw an exception if the incrementVar key is not a string', function (done) {
        renderString('{{incrementVar 1}}').catch(e => {
            done();
        });
    });

    it('should correctly increment', function(done) {
        runTestCases([
            {
                input: "{{incrementVar 'data1'}}{{getVar 'data1'}} {{incrementVar 'data1'}}{{getVar 'data1'}} {{incrementVar 'data1'}}{{getVar 'data1'}}",
                output: '00 11 22',
            },
        ], done);
    });

    it('should correctly increment an existing variable', function(done) {
        runTestCases([
            {
                input: "{{assignVar 'data1' value1}}{{getVar 'data1'}} {{incrementVar 'data1'}}",
                output: '12 13',
            },
            {
                input: "{{assignVar 'data1' 12}}{{getVar 'data1'}} {{incrementVar 'data1'}}",
                output: '12 13',
            },
            {
                input: "{{assignVar 'data1' -12}}{{getVar 'data1'}} {{incrementVar 'data1'}}",
                output: '-12 -11',
            },
        ], done);
    });

    it('should correctly overwrite an existing non-integer variable', function(done) {
        runTestCases([
            {
                input: "{{assignVar 'data1' 'a'}}{{getVar 'data1'}} {{incrementVar 'data1'}}",
                output: 'a 0',
            },
        ], done);
    });
});
