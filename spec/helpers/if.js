var Code = require('code'),
    Lab = require('lab'),
    lab = exports.lab = Lab.script(),
    describe = lab.experiment,
    expect = Code.expect,
    it = lab.it,
    renderString = require('../spec-helpers').renderString;

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
        expect(renderString('{{#if 1}}{{big}}{{/if}}', context))
            .to.be.equal('big');

        expect(renderString('{{#if 1}}big{{/if}}', context))
            .to.be.equal('big');

        expect(renderString('{{#if "x"}}big{{/if}}', context))
            .to.be.equal('big');

        expect(renderString('{{#if ""}}big{{/if}}', context))
            .to.be.equal('');

        expect(renderString('{{#if 0}}big{{/if}}', context))
            .to.be.equal('');

        expect(renderString('{{#if ""}}big{{else}}small{{/if}}', context))
            .to.be.equal('small');

        expect(renderString('{{#if 0}}big{{else}}small{{/if}}', context))
            .to.be.equal('small');

        expect(renderString('{{#if num2}}big{{else}}small{{/if}}', context))
            .to.be.equal('big');

        expect(renderString('{{#if product}}big{{else}}small{{/if}}', context))
            .to.be.equal('big');

        expect(renderString('{{#if string}}big{{else}}small{{/if}}', context))
            .to.be.equal('big');

        done();
    });

    it('should render "big" if all conditions match', done => {

        expect(renderString('{{#if "1" "==" num1}}big{{/if}}', context))
            .to.be.equal('big');

        expect(renderString('{{#if 1 "===" num1}}big{{/if}}', context))
            .to.be.equal('big');

        expect(renderString('{{#if 2 "!==" num1}}big{{/if}}', context))
            .to.be.equal('big');

        expect(renderString('{{#if num2 "!=" num1}}big{{/if}}', context))
            .to.be.equal('big');

        expect(renderString('{{#if num2 ">" num1}}big{{/if}}', context))
            .to.be.equal('big');

        expect(renderString('{{#if num1 "<" num2}}big{{/if}}', context))
            .to.be.equal('big');

        expect(renderString('{{#if num2 ">=" num1}}big{{/if}}', context))
            .to.be.equal('big');

        expect(renderString('{{#if num1 "<=" num2}}big{{/if}}', context))
            .to.be.equal('big');

        expect(renderString('{{#if product "typeof" "object"}}big{{/if}}', context))
            .to.be.equal('big');

        expect(renderString('{{#if "2" "gtnum" "1"}}big{{/if}}', context))
            .to.be.equal('big');

        expect(renderString('{{#if string "typeof" "string"}}big{{/if}}', context))
            .to.be.equal('big');

        done();
    });

    it('should render empty for all cases', done => {

        expect(renderString('{{#if "2" "==" num1}}big{{/if}}', context))
            .to.be.equal('');

        expect(renderString('{{#if 2 "===" num1}}big{{/if}}', context))
            .to.be.equal('');

        expect(renderString('{{#if 1 "!==" num1}}big{{/if}}', context))
            .to.be.equal('');

        expect(renderString('{{#if num2 "!=" 2}}big{{/if}}', context))
            .to.be.equal('');

        expect(renderString('{{#if num1 ">" 20}}big{{/if}}', context))
            .to.be.equal('');

        expect(renderString('{{#if 4 "<" num2}}big{{/if}}', context))
            .to.be.equal('');

        expect(renderString('{{#if num1 ">=" 40}}big{{/if}}', context))
            .to.be.equal('');

        expect(renderString('{{#if num2 "<=" num1}}big{{/if}}', context))
            .to.be.equal('');

        expect(renderString('{{#if "1" "gtnum" "2"}}big{{/if}}', context))
            .to.be.equal('');

        expect(renderString('{{#if "1" "gtnum" "1"}}big{{/if}}', context))
            .to.be.equal('');

        expect(renderString('{{#if product "typeof" "string"}}big{{/if}}', context))
            .to.be.equal('');

        expect(renderString('{{#if string "typeof" "object"}}big{{/if}}', context))
            .to.be.equal('');

        done();
    });


    it('should throw an exeption when non string value sent to gtnum', function (done) {
        try {
            renderString('{{#if num1 "gtnum" "2"}}big{{/if}}');
        } catch(e) {
            expect(e.message).to.equal('Handlerbars Helper if gtnum accepts ONLY valid number string');
        }

        try {
            renderString('{{#if "2" "gtnum" num2}}big{{/if}}');
        } catch(e) {
            expect(e.message).to.equal('Handlerbars Helper if gtnum accepts ONLY valid number string');
        }

        try {
            renderString('{{#if num1 "gtnum" num2}}big{{/if}}');
        } catch(e) {
            expect(e.message).to.equal('Handlerbars Helper if gtnum accepts ONLY valid number string');
        }

        done();
    });

    it('should throw an exeption when NaN value sent to gtnum', function (done) {
        try {
            renderString('{{#if "aaaa" "gtnum" "2"}}big{{/if}}');
        } catch(e) {
            expect(e.message).to.equal('Handlerbars Helper if gtnum accepts ONLY valid number string');
        }

        try {
            renderString('{{#if "2" "gtnum" "bbbb"}}big{{/if}}');
        } catch(e) {
            expect(e.message).to.equal('Handlerbars Helper if gtnum accepts ONLY valid number string');
        }

        try {
            renderString('{{#if "aaaa" "gtnum" "bbbb"}}big{{/if}}');
        } catch(e) {
            expect(e.message).to.equal('Handlerbars Helper if gtnum accepts ONLY valid number string');
        }

        done();
    });


    it('should render "big" if all ifs match', done => {

        var context = {
            num1: 1,
            num2: 2,
            product: {a: 1, b: 2},
            string: 'yolo'
        };

        expect(renderString('{{#if "1" num1 operator="=="}}big{{/if}}', context))
            .to.be.equal('big');

        expect(renderString('{{#if 1 num1 operator="==="}}big{{/if}}', context))
            .to.be.equal('big');

        expect(renderString('{{#if 2 num1 operator="!=="}}big{{/if}}', context))
            .to.be.equal('big');

        expect(renderString('{{#if num2 num1 operator="!="}}big{{/if}}', context))
            .to.be.equal('big');

        expect(renderString('{{#if num2 num1 operator=">"}}big{{/if}}', context))
            .to.be.equal('big');

        expect(renderString('{{#if num1 num2 operator="<"}}big{{/if}}', context))
            .to.be.equal('big');

        expect(renderString('{{#if num2 num1 operator=">="}}big{{/if}}', context))
            .to.be.equal('big');

        expect(renderString('{{#if num1 num2 operator="<="}}big{{/if}}', context))
            .to.be.equal('big');

        expect(renderString('{{#if product "object" operator="typeof"}}big{{/if}}', context))
            .to.be.equal('big');

        expect(renderString('{{#if string "string" operator="typeof"}}big{{/if}}', context))
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

        expect(renderString('{{#if emptyObject}}big{{/if}}', context))
            .to.be.equal('');

        expect(renderString('{{#if emptyArray}}big{{/if}}', context))
            .to.be.equal('');

        expect(renderString('{{#if emptyArray.length}}big{{/if}}', context))
            .to.be.equal('');

        expect(renderString('{{#if "2" num1 operator="=="}}big{{/if}}', context))
            .to.be.equal('');

        expect(renderString('{{#if 2 num1 operator="==="}}big{{/if}}', context))
            .to.be.equal('');

        expect(renderString('{{#if 1 num1 operator="!=="}}big{{/if}}', context))
            .to.be.equal('');

        expect(renderString('{{#if num2 2 operator="!="}}big{{/if}}', context))
            .to.be.equal('');

        expect(renderString('{{#if num1 20 operator=">"}}big{{/if}}', context))
            .to.be.equal('');

        expect(renderString('{{#if 4 num2 operator="<"}}big{{/if}}', context))
            .to.be.equal('');

        expect(renderString('{{#if num1 40 operator=">="}}big{{/if}}', context))
            .to.be.equal('');

        expect(renderString('{{#if num2 num1 operator="<="}}big{{/if}}', context))
            .to.be.equal('');

        expect(renderString('{{#if product "string" operator="typeof"}}big{{/if}}', context))
            .to.be.equal('');

        expect(renderString('{{#if string "object" operator="typeof"}}big{{/if}}', context))
            .to.be.equal('');

        done();
    });

    it('should work as a non-block helper when used as a subexpression', done => {
        expect(renderString('{{#if (if num1 "!==" num2)}}{{big}}{{/if}}', context))
            .to.be.equal('big');

        expect(renderString('{{#all (if num1 "!==" num2) "1" true}}big{{/all}}', context))
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
        expect(renderString('{{#unless num1 "===" num2}}hello{{/unless}}', context))
            .to.be.equal('hello');

        expect(renderString('{{#unless alwaysFalse}}hello{{/unless}}', context))
            .to.be.equal('hello');

        expect(renderString('{{#unless does_not_exist}}hello{{/unless}}', context))
            .to.be.equal('hello');

        done();
    });

    it('should print empty', done => {
        expect(renderString('{{#unless num1 "===" num1}}hello{{/unless}}', context))
            .to.be.equal('');

        expect(renderString('{{#unless alwaysTrue}}hello{{/unless}}', context))
            .to.be.equal('');

        expect(renderString('{{#unless product}}hello{{/unless}}', context))
            .to.be.equal('');

        done();
    });

    it('should work with arrays', done => {
        expect(renderString('{{#unless emptyArray}}foo{{else}}bar{{/unless}}', context))
            .to.be.equal('foo');

        expect(renderString('{{#unless notEmptyArray}}foo{{else}}bar{{/unless}}', context))
            .to.be.equal('bar');

        done();
    });

    it('should work as a non-block helper when used as a subexpression', done => {
        expect(renderString('{{#if (unless num1 "===" num2)}}big{{/if}}', context))
            .to.be.equal('big');

        expect(renderString('{{#all (unless num1 "===" num2) "1" true}}big{{/all}}', context))
            .to.be.equal('big');

        done();
    });
})
