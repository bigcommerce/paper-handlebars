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

describe('if helper', () => {
    var context = {
        num1: 1,
        num2: 2,
        product: {a: 1, b: 2},
        string: 'yolo',
        alwaysTrue: true,
        alwaysFalse: true,
        big: 'big'
    };

    it('should have the same behavior as the original if helper', done => {
        expect(c('{{#if 1}}{{big}}{{/if}}', context))
            .to.be.equal('big');

        expect(c('{{#if 1}}big{{/if}}', context))
            .to.be.equal('big');

        expect(c('{{#if "x"}}big{{/if}}', context))
            .to.be.equal('big');

        expect(c('{{#if ""}}big{{/if}}', context))
            .to.be.equal('');

        expect(c('{{#if 0}}big{{/if}}', context))
            .to.be.equal('');

        expect(c('{{#if ""}}big{{else}}small{{/if}}', context))
            .to.be.equal('small');

        expect(c('{{#if 0}}big{{else}}small{{/if}}', context))
            .to.be.equal('small');

        expect(c('{{#if num2}}big{{else}}small{{/if}}', context))
            .to.be.equal('big');

        expect(c('{{#if product}}big{{else}}small{{/if}}', context))
            .to.be.equal('big');

        expect(c('{{#if string}}big{{else}}small{{/if}}', context))
            .to.be.equal('big');

        done();
    });

    it('should render "big" if all conditions match', done => {

        expect(c('{{#if "1" "==" num1}}big{{/if}}', context))
            .to.be.equal('big');

        expect(c('{{#if 1 "===" num1}}big{{/if}}', context))
            .to.be.equal('big');

        expect(c('{{#if 2 "!==" num1}}big{{/if}}', context))
            .to.be.equal('big');

        expect(c('{{#if num2 "!=" num1}}big{{/if}}', context))
            .to.be.equal('big');

        expect(c('{{#if num2 ">" num1}}big{{/if}}', context))
            .to.be.equal('big');

        expect(c('{{#if num1 "<" num2}}big{{/if}}', context))
            .to.be.equal('big');

        expect(c('{{#if num2 ">=" num1}}big{{/if}}', context))
            .to.be.equal('big');

        expect(c('{{#if num1 "<=" num2}}big{{/if}}', context))
            .to.be.equal('big');

        expect(c('{{#if product "typeof" "object"}}big{{/if}}', context))
            .to.be.equal('big');

        expect(c('{{#if string "typeof" "string"}}big{{/if}}', context))
            .to.be.equal('big');

        done();
    });

    it('should render empty for all cases', done => {

        expect(c('{{#if "2" "==" num1}}big{{/if}}', context))
            .to.be.equal('');

        expect(c('{{#if 2 "===" num1}}big{{/if}}', context))
            .to.be.equal('');

        expect(c('{{#if 1 "!==" num1}}big{{/if}}', context))
            .to.be.equal('');

        expect(c('{{#if num2 "!=" 2}}big{{/if}}', context))
            .to.be.equal('');

        expect(c('{{#if num1 ">" 20}}big{{/if}}', context))
            .to.be.equal('');

        expect(c('{{#if 4 "<" num2}}big{{/if}}', context))
            .to.be.equal('');

        expect(c('{{#if num1 ">=" 40}}big{{/if}}', context))
            .to.be.equal('');

        expect(c('{{#if num2 "<=" num1}}big{{/if}}', context))
            .to.be.equal('');

        expect(c('{{#if product "typeof" "string"}}big{{/if}}', context))
            .to.be.equal('');

        expect(c('{{#if string "typeof" "object"}}big{{/if}}', context))
            .to.be.equal('');

        done();
    });


    it('should render "big" if all ifs match', done => {

        var context = {
            num1: 1,
            num2: 2,
            product: {a: 1, b: 2},
            string: 'yolo'
        };

        expect(c('{{#if "1" num1 operator="=="}}big{{/if}}', context))
            .to.be.equal('big');

        expect(c('{{#if 1 num1 operator="==="}}big{{/if}}', context))
            .to.be.equal('big');

        expect(c('{{#if 2 num1 operator="!=="}}big{{/if}}', context))
            .to.be.equal('big');

        expect(c('{{#if num2 num1 operator="!="}}big{{/if}}', context))
            .to.be.equal('big');

        expect(c('{{#if num2 num1 operator=">"}}big{{/if}}', context))
            .to.be.equal('big');

        expect(c('{{#if num1 num2 operator="<"}}big{{/if}}', context))
            .to.be.equal('big');

        expect(c('{{#if num2 num1 operator=">="}}big{{/if}}', context))
            .to.be.equal('big');

        expect(c('{{#if num1 num2 operator="<="}}big{{/if}}', context))
            .to.be.equal('big');

        expect(c('{{#if product "object" operator="typeof"}}big{{/if}}', context))
            .to.be.equal('big');

        expect(c('{{#if string "string" operator="typeof"}}big{{/if}}', context))
            .to.be.equal('big');

        done();
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

        expect(c('{{#if emptyObject}}big{{/if}}', context))
            .to.be.equal('');

        expect(c('{{#if emptyArray}}big{{/if}}', context))
            .to.be.equal('');

        expect(c('{{#if emptyArray.length}}big{{/if}}', context))
            .to.be.equal('');

        expect(c('{{#if "2" num1 operator="=="}}big{{/if}}', context))
            .to.be.equal('');

        expect(c('{{#if 2 num1 operator="==="}}big{{/if}}', context))
            .to.be.equal('');

        expect(c('{{#if 1 num1 operator="!=="}}big{{/if}}', context))
            .to.be.equal('');

        expect(c('{{#if num2 2 operator="!="}}big{{/if}}', context))
            .to.be.equal('');

        expect(c('{{#if num1 20 operator=">"}}big{{/if}}', context))
            .to.be.equal('');

        expect(c('{{#if 4 num2 operator="<"}}big{{/if}}', context))
            .to.be.equal('');

        expect(c('{{#if num1 40 operator=">="}}big{{/if}}', context))
            .to.be.equal('');

        expect(c('{{#if num2 num1 operator="<="}}big{{/if}}', context))
            .to.be.equal('');

        expect(c('{{#if product "string" operator="typeof"}}big{{/if}}', context))
            .to.be.equal('');

        expect(c('{{#if string "object" operator="typeof"}}big{{/if}}', context))
            .to.be.equal('');

        done();
    });

    it('should work as a non-block helper when used as a subexpression', done => {
        expect(c('{{#if (if num1 "!==" num2)}}{{big}}{{/if}}', context))
            .to.be.equal('big');

        expect(c('{{#all (if num1 "!==" num2) "1" true}}big{{/all}}', context))
            .to.be.equal('big');

        done();
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

    it('should print hello', done => {
        expect(c('{{#unless num1 "===" num2}}hello{{/unless}}', context))
            .to.be.equal('hello');

        expect(c('{{#unless alwaysFalse}}hello{{/unless}}', context))
            .to.be.equal('hello');

        expect(c('{{#unless does_not_exist}}hello{{/unless}}', context))
            .to.be.equal('hello');

        done();
    });

    it('should print empty', done => {
        expect(c('{{#unless num1 "===" num1}}hello{{/unless}}', context))
            .to.be.equal('');

        expect(c('{{#unless alwaysTrue}}hello{{/unless}}', context))
            .to.be.equal('');

        expect(c('{{#unless product}}hello{{/unless}}', context))
            .to.be.equal('');

        done();
    });

    it('should work with arrays', done => {
        expect(c('{{#unless emptyArray}}foo{{else}}bar{{/unless}}', context))
            .to.be.equal('foo');

        expect(c('{{#unless notEmptyArray}}foo{{else}}bar{{/unless}}', context))
            .to.be.equal('bar');

        done();
    });

    it('should work as a non-block helper when used as a subexpression', done => {
        expect(c('{{#if (unless num1 "===" num2)}}big{{/if}}', context))
            .to.be.equal('big');

        expect(c('{{#all (unless num1 "===" num2) "1" true}}big{{/all}}', context))
            .to.be.equal('big');

        done();
    });
})
