const Lab = require('lab'),
      lab = exports.lab = Lab.script(),
      describe = lab.experiment,
      it = lab.it,
      specHelpers = require('../spec-helpers'),
      testRunner = specHelpers.testRunner,
      renderString = specHelpers.renderString;

describe('if helper', () => {
    const context = {
        num1: 1,
        num2: 2,
        product: {a: 1, b: 2},
        string: 'yolo',
        alwaysTrue: true,
        alwaysFalse: true,
        big: 'big'
    };

    const runTestCases = testRunner({context});

    it('should have the same behavior as the original if helper', done => {
        runTestCases([
            {
                input: '{{#if 1}}{{big}}{{/if}}',
                output: 'big',
            },
            {
                input: '{{#if 1}}big{{/if}}',
                output: 'big',
            },
            {
                input: '{{#if "x"}}big{{/if}}',
                output: 'big',
            },
            {
                input: '{{#if ""}}big{{/if}}',
                output: '',
            },
            {
                input: '{{#if 0}}big{{/if}}',
                output: '',
            },
            {
                input: '{{#if ""}}big{{else}}small{{/if}}',
                output: 'small',
            },
            {
                input: '{{#if 0}}big{{else}}small{{/if}}',
                output: 'small',
            },
            {
                input: '{{#if num2}}big{{else}}small{{/if}}',
                output: 'big',
            },
            {
                input: '{{#if product}}big{{else}}small{{/if}}',
                output: 'big',
            },
            {
                input: '{{#if string}}big{{else}}small{{/if}}',
                output: 'big',
            },
        ], done);
    });

    it('should render "big" if all conditions match', done => {
        runTestCases([
            {
                input: '{{#if "1" "==" num1}}big{{/if}}',
                output: 'big',
            },
            {
                input: '{{#if 1 "===" num1}}big{{/if}}',
                output: 'big',
            },
            {
                input: '{{#if 2 "!==" num1}}big{{/if}}',
                output: 'big',
            },
            {
                input: '{{#if num2 "!=" num1}}big{{/if}}',
                output: 'big',
            },
            {
                input: '{{#if num2 ">" num1}}big{{/if}}',
                output: 'big',
            },
            {
                input: '{{#if num1 "<" num2}}big{{/if}}',
                output: 'big',
            },
            {
                input: '{{#if num2 ">=" num1}}big{{/if}}',
                output: 'big',
            },
            {
                input: '{{#if num1 "<=" num2}}big{{/if}}',
                output: 'big',
            },
            {
                input: '{{#if product "typeof" "object"}}big{{/if}}',
                output: 'big',
            },
            {
                input: '{{#if "2" "gtnum" "1"}}big{{/if}}',
                output: 'big',
            },
            {
                input: '{{#if string "typeof" "string"}}big{{/if}}',
                output: 'big',
            },
        ], done);
    });

    it('should render empty for all cases', done => {
        runTestCases([
            {
                input: '{{#if "2" "==" num1}}big{{/if}}',
                output: '',
            },
            {
                input: '{{#if 2 "===" num1}}big{{/if}}',
                output: '',
            },
            {
                input: '{{#if 1 "!==" num1}}big{{/if}}',
                output: '',
            },
            {
                input: '{{#if num2 "!=" 2}}big{{/if}}',
                output: '',
            },
            {
                input: '{{#if num1 ">" 20}}big{{/if}}',
                output: '',
            },
            {
                input: '{{#if 4 "<" num2}}big{{/if}}',
                output: '',
            },
            {
                input: '{{#if num1 ">=" 40}}big{{/if}}',
                output: '',
            },
            {
                input: '{{#if num2 "<=" num1}}big{{/if}}',
                output: '',
            },
            {
                input: '{{#if "1" "gtnum" "2"}}big{{/if}}',
                output: '',
            },
            {
                input: '{{#if "1" "gtnum" "1"}}big{{/if}}',
                output: '',
            },
            {
                input: '{{#if product "typeof" "string"}}big{{/if}}',
                output: '',
            },
            {
                input: '{{#if string "typeof" "object"}}big{{/if}}',
                output: '',
            },
        ], done);
    });

    it('should ignore additional arguments and process only the first three arguments', done => {
        runTestCases([
            {
                input: '{{#if "1" "<" "2" ">" "3"}}big{{/if}}',
                output: 'big'
            },
            {
                input: '{{#if "1" "<" "-1" ">" "3"}}big{{/if}}',
                output: ''
            },
            {
                input: '{{#if "1" "<" "1" ">" "3"}}big{{/if}}',
                output: ''
            }
        ], done)
    });

    it('should throw an exception when non string value sent to gtnum', function (done) {
        renderString('{{#if num1 "gtnum" "2"}}big{{/if}}').catch(e => {
            renderString('{{#if "2" "gtnum" num2}}big{{/if}}').catch(e => {
                renderString('{{#if num1 "gtnum" num2}}big{{/if}}').catch(e => {
                    done();
                });
            });
        });
    });

    it('should throw an exception when NaN value sent to gtnum', function (done) {
        renderString('{{#if "aaaa" "gtnum" "2"}}big{{/if}}').catch(e => {
            renderString('{{#if "2" "gtnum" "bbbb"}}big{{/if}}').catch(e => {
                renderString('{{#if "aaaa" "gtnum" "bbbb"}}big{{/if}}').catch(e => {
                    done();
                });
            });
        });
    });


    it('should render "big" if all ifs match', done => {
        const context = {
            num1: 1,
            num2: 2,
            product: {a: 1, b: 2},
            string: 'yolo'
        };

        runTestCases([
            {
                input: '{{#if "1" num1 operator="=="}}big{{/if}}',
                output: 'big',
                context: context,
            },
            {
                input: '{{#if 1 num1 operator="==="}}big{{/if}}',
                output: 'big',
                context: context,
            },
            {
                input: '{{#if 2 num1 operator="!=="}}big{{/if}}',
                output: 'big',
                context: context,
            },
            {
                input: '{{#if num2 num1 operator="!="}}big{{/if}}',
                output: 'big',
                context: context,
            },
            {
                input: '{{#if num2 num1 operator=">"}}big{{/if}}',
                output: 'big',
                context: context,
            },
            {
                input: '{{#if num1 num2 operator="<"}}big{{/if}}',
                output: 'big',
                context: context,
            },
            {
                input: '{{#if num2 num1 operator=">="}}big{{/if}}',
                output: 'big',
                context: context,
            },
            {
                input: '{{#if num1 num2 operator="<="}}big{{/if}}',
                output: 'big',
                context: context,
            },
            {
                input: '{{#if product "object" operator="typeof"}}big{{/if}}',
                output: 'big',
                context: context,
            },
            {
                input: '{{#if string "string" operator="typeof"}}big{{/if}}',
                output: 'big',
                context: context,
            },
        ], done);
    });

    it('should render empty for all cases', done => {
        const context = {
            num1: 1,
            num2: 2,
            product: {a: 1, b: 2},
            string: 'yolo',
            emptyArray: [],
            emptyObject: {}
        };

        runTestCases([
            {
                input: '{{#if emptyObject}}big{{/if}}',
                output: '',
                context: context,
            },
            {
                input: '{{#if emptyArray}}big{{/if}}',
                output: '',
                context: context,
            },
            {
                input: '{{#if emptyArray.length}}big{{/if}}',
                output: '',
                context: context,
            },
            {
                input: '{{#if "2" num1 operator="=="}}big{{/if}}',
                output: '',
                context: context,
            },
            {
                input: '{{#if 2 num1 operator="==="}}big{{/if}}',
                output: '',
                context: context,
            },
            {
                input: '{{#if 1 num1 operator="!=="}}big{{/if}}',
                output: '',
                context: context,
            },
            {
                input: '{{#if num2 2 operator="!="}}big{{/if}}',
                output: '',
                context: context,
            },
            {
                input: '{{#if num1 20 operator=">"}}big{{/if}}',
                output: '',
                context: context,
            },
            {
                input: '{{#if 4 num2 operator="<"}}big{{/if}}',
                output: '',
                context: context,
            },
            {
                input: '{{#if num1 40 operator=">="}}big{{/if}}',
                output: '',
                context: context,
            },
            {
                input: '{{#if num2 num1 operator="<="}}big{{/if}}',
                output: '',
                context: context,
            },
            {
                input: '{{#if product "string" operator="typeof"}}big{{/if}}',
                output: '',
                context: context,
            },
            {
                input: '{{#if string "object" operator="typeof"}}big{{/if}}',
                output: '',
                context: context,
            },
        ], done);
    });

    it('should work as a non-block helper when used as a subexpression', done => {
        runTestCases([
            {
                input: '{{#if (if num1 "!==" num2)}}{{big}}{{/if}}',
                output: 'big',
            },
            {
                input: '{{#all (if num1 "!==" num2) "1" true}}big{{/all}}',
                output: 'big',
            },
        ], done);
    });
});

describe('unless helper', () => {
    const context = {
        num1: 1,
        num2: 2,
        product: {a: 1, b: 2},
        alwaysTrue: true,
        alwaysFalse: false,
        notEmptyArray: [ 1, 2 , 3 ],
        emptyArray: [],
    };

    const runTestCases = testRunner({context});

    it('should print hello', done => {
        runTestCases([
              {
                  input: '{{#unless num1 "===" num2}}hello{{/unless}}',
                  output: 'hello',
              },
              {
                  input: '{{#unless alwaysFalse}}hello{{/unless}}',
                  output: 'hello',
              },
              {
                  input: '{{#unless does_not_exist}}hello{{/unless}}',
                  output: 'hello',
              },
        ], done);
    });

    it('should print empty', done => {
        runTestCases([
              {
                  input: '{{#unless num1 "===" num1}}hello{{/unless}}',
                  output: '',
              },
              {
                  input: '{{#unless alwaysTrue}}hello{{/unless}}',
                  output: '',
              },
              {
                  input: '{{#unless product}}hello{{/unless}}',
                  output: '',
              },
        ], done);
    });

    it('should work with arrays', done => {
        runTestCases([
              {
                  input: '{{#unless emptyArray}}foo{{else}}bar{{/unless}}',
                  output: 'foo',
              },
              {
                  input: '{{#unless notEmptyArray}}foo{{else}}bar{{/unless}}',
                  output: 'bar',
              },
        ], done);
    });

    it('should work as a non-block helper when used as a subexpression', done => {
        runTestCases([
              {
                  input: '{{#if (unless num1 "===" num2)}}big{{/if}}',
                  output: 'big',
              },
              {
                  input: '{{#all (unless num1 "===" num2) "1" true}}big{{/all}}',
                  output: 'big',
              },
        ], done);
    });
})
