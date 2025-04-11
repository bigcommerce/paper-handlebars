const Lab = require('lab'),
    lab = exports.lab = Lab.script(),
    describe = lab.experiment,
    it = lab.it,
    specHelpers = require('../spec-helpers'),
    testRunner = specHelpers.testRunner,
    renderString = specHelpers.renderString;
const AssignVarHelper = require('../../helpers/assignVar')[0];

describe('assignVar and getVar helpers', function() {

    const generateOverflowString = (length, char) => {
        return `${[...Array(length).keys()].map(_=>char).join("")}`;
    }

    const context = {
        value1: "Big",
        value2: "Commerce",
        value3: 12,
        value4: -12.34,
        valueUnderStringBuffer: generateOverflowString(AssignVarHelper.max_length-1, "U"),
        // Bug in testing suite, strings in context that are over or equal to the max length are not being sent to the
        // helpers. instead an `undefined` is being sent. To handle this we can use a template string in the tests
        // directly to pretend that the string is being sent to the helpers.
        valueFillStringBuffer: generateOverflowString(AssignVarHelper.max_length, "F"),
        valueOverflowStringBufferBy1: generateOverflowString(AssignVarHelper.max_length+1, "O"),
        valueEmptyString: "",
        valueNull: null,
        valueEncodedSafeString: "<script>alert('XSS')</script>",
    };

    const runTestCases = testRunner({context});

    it('should throw an exception if the assignVar key is not a string', function (done) {
        renderString('{{assignVar 1 2}}').catch(e => {
            done();
        });
    });

    it('should throw an exception if the getVar key is not a string', function (done) {
        renderString('{{getVar 2}}').catch(e => {
            done();
        });
    });

    it('should assign and get variables', function(done) {
        runTestCases([
            {
                // New test case: Assigning a variable with an empty string value
                input: "{{assignVar 'data1' valueEmptyString}}{{getVar 'data1'}}",
                output: '',
            },
            {
                // New test case: Assigning a variable with a string value, then delete it by assigning null
                input: "{{assignVar 'data1' value1}}{{getVar 'data1'}} {{assignVar 'data1' null}}{{getVar 'data1'}} {{assignVar 'data1' value1}}{{getVar 'data1'}} {{assignVar 'data1' valueNull}}{{getVar 'data1'}}",
                output: 'Big  Big ',
            },
            {
                // New test case: Assigning a variable with a string value, then delete it by assigning undefined
                input: "{{assignVar 'data1' value1}}{{getVar 'data1'}} {{assignVar 'data1' undefined}}{{getVar 'data1'}}",
                output: 'Big ',
            },
            {
                input: "{{assignVar 'data1' value1}}{{assignVar 'data2' 12}}{{getVar 'data1'}} {{getVar 'data2'}}",
                output: 'Big 12',
            },
            {
                input: "{{assignVar 'data1' value1}}{{assignVar 'data2' value4}}{{getVar 'data1'}} {{getVar 'data2'}}",
                output: 'Big -12.34',
            },
            {
                input: "{{assignVar 'data1' value1}}{{assignVar 'data2' value2}}{{getVar 'data1'}}{{getVar 'data2'}}",
                output: 'BigCommerce',
            },
            {
                input: "{{assignVar 'data1' null}}{{assignVar 'data2' undefined}}{{getVar 'data1'}}{{getVar 'data2'}}",
                output: '',
            },
        ], done);
    });

    // Check to see if the assignVar still works when the situation is that no data has been stored yet, and a delete instruction is given.
    it('should accept null and undefined as input before any variables are stored', function(done) {
        runTestCases([
            {
                input: "{{assignVar 'data1' null}}{{assignVar 'data2' undefined}}{{getVar 'data1'}}{{getVar 'data2'}}",
                output: '',
            },
        ], done);
    });

    it('should return empty string if variable is not defined', function(done) {
        runTestCases([
            {
                input: "{{getVar 'data3'}}",
                output: '',
            },
            {
                input: "{{assignVar 'data1' value1}}{{getVar 'data3'}}",
                output: '',
            },
        ], done);
    });

    it('should return empty string if variable is not *yet* defined', function(done) {
        runTestCases([
            {
                input: "{{getVar 'data1'}}{{assignVar 'data1' value1}}",
                output: '',
            },
        ], done);
    });

    it('should return integers with correct type', function(done) {
        runTestCases([
            {
                input: "{{assignVar 'data1' value3}}{{assignVar 'data2' 10}}{{getVar 'data1'}} + {{getVar 'data2'}} = {{add (getVar 'data1') (getVar 'data2')}}",
                output: '12 + 10 = 22',
            },
        ], done);
    });

    it('should accept a "SafeString" object as a valid alternative to a string (results should be a string when stored)', function(done) {
        runTestCases([
            {
                input: "{{assignVar 'data1' (encodeHtmlEntities valueEncodedSafeString)}}{{getVar 'data1'}}",
                output: '&amp;#x3C;script&amp;#x3E;alert(&amp;#x27;XSS&amp;#x27;)&amp;#x3C;/script&amp;#x3E;', // SAY NO TO XSS
            },
        ], done);
    });

    it(`should accept a string up to the maximum length of the buffer (Max length: ${AssignVarHelper.max_length})`, function(done) {
        runTestCases([
            {
                input: "{{assignVar 'data1' valueUnderStringBuffer}}{{getVar 'data1'}}",
                output: `${context.valueUnderStringBuffer}`,
            },
        ], done);
    });

    it(`should throw an error if buffer is filled (Max length: ${AssignVarHelper.max_length})`,
        function(done) {
            renderString(`{{assignVar "fill" "${context.valueFillStringBuffer}"}}`).catch(e => {
                // If inline injection of string is not done, the test will fail when it should pass via the catch.
                // See context above for more information.
                done();
            });
        }
    );

    it(`should throw an error if buffer is overflowed (Max length: ${AssignVarHelper.max_length})`,
        function(done) {
            renderString(`{{assignVar 'overflow' "${context.valueOverflowStringBufferBy1}"}}`).catch(e => {
                // If inline injection of string is not done, the test will fail when it should pass via the catch.
                // See context above for more information.
                done();
            });
        }
    );

    it('should return undefined accessing proto/constructor', function(done) {
        runTestCases([
            {
                input: "{{getVar '__proto__'}}",
                output: '',
            },
            {
                input: "{{getVar 'constructor'}}",
                output: '',
            },
        ], done);
    });
});
