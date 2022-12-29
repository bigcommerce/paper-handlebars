const Lab = require('lab'),
      lab = exports.lab = Lab.script(),
      describe = lab.experiment,
      it = lab.it,
    //   specHelpers = require('../spec-helpers'),
      testRunner = require('../spec-helpers').testRunner;
    //   renderString = specHelpers.renderString;


describe('multiConcat helper', function() {
    const context = {
        string: "First",
        string2: "Second",
        string3: "Third"
    };

    const runTestCases = testRunner({context});

    it('should concat all string by default', function(done) {
        runTestCases([
            {
                input: '{{multiConcat string string2 string3}}',
                output: 'FirstSecondThird',
            }
        ], done);
    });

    // it('should replace multiple if given quantity', function(done) {
    //     runTestCases([
    //         {
    //             input: '{{multiConcat string string2 string3 -5}}',
    //             output: 'My name is Albe Albe Albe',
    //         },
    //         {
    //             input: '{{multiConcat string string2 string3 0}}',
    //             output: 'My name is Albe Albe Albe',
    //         },
    //         {
    //             input: '{{multiConcat string string2 string3 2}}',
    //             output: 'My name is Alex Alex Albe',
    //         },
    //         {
    //             input: '{{multiConcat string string2 string3 4}}',
    //             output: 'My name is Alex Alex Alex',
    //         },
    //         {
    //             input: '{{multiConcat string string2 string3 100}}',
    //             output: 'My name is Alex Alex Alex',
    //         },
    //     ], done);
    // });

    // it('should throw an exception if the parameters have an invalid type', function(done) {
    //     renderString('{{multiConcat object "none" "Bob"}}').catch(e => {
    //         renderString('{{multiConcat "none" 3 "Bob"}}').catch(e => {
    //             renderString('{{multiConcat "none" "Bob" object}}').catch(e => {
    //                 renderString('{{multiConcat string string2 string3 "3"}}').catch(e => {
    //                     done();
    //                 });
    //             });
    //         });
    //     });
    // });
});
