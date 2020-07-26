const Lab = require('lab'),
    lab = exports.lab = Lab.script(),
    describe = lab.experiment,
    it = lab.it,
    specHelpers = require('../spec-helpers'),
    testRunner = specHelpers.testRunner,
    renderString = specHelpers.renderString;


describe('decrementVar helper', function() {
    const context = {
        value1: 12
    };

    const runTestCases = testRunner({context});

    it('should throw an exception if the decrementVar key is not a string', function (done) {
        renderString('{{decrementVar 1}}').catch(e => {
            done();
        });
    });

    it('should correctly decrement', function(done) {
        runTestCases([
            {
                input: "{{decrementVar 'data1'}}{{getVar 'data1'}} {{decrementVar 'data1'}}{{getVar 'data1'}} {{decrementVar 'data1'}}{{getVar 'data1'}}",
                output: '00 -1-1 -2-2',
            },
        ], done);
    });

    it('should correctly decrement an existing variable', function(done) {
        runTestCases([
            {
                input: "{{assignVar 'data1' value1}}{{getVar 'data1'}} {{decrementVar 'data1'}}",
                output: '12 11',
            },
            {
                input: "{{assignVar 'data1' 12}}{{getVar 'data1'}} {{decrementVar 'data1'}}",
                output: '12 11',
            },
            {
                input: "{{assignVar 'data1' -12}}{{getVar 'data1'}} {{decrementVar 'data1'}}",
                output: '-12 -13',
            },
        ], done);
    });

    it('should correctly overwrite an existing non-integer variable', function(done) {
        runTestCases([
            {
                input: "{{assignVar 'data1' 'a'}}{{getVar 'data1'}} {{decrementVar 'data1'}}",
                output: 'a 0',
            },
        ], done);
    });
});
