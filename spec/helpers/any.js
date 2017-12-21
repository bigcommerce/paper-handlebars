const Code = require('code'),
      Lab = require('lab'),
      lab = exports.lab = Lab.script(),
      describe = lab.experiment,
      expect = Code.expect,
      it = lab.it,
      renderString = require('../spec-helpers').renderString;

describe('any helper (with option hash)', function() {
    var context = {
        big: 'big',
        arrayWithObjs: [{a: 1},{b: 1},{a: 2}]
    };

    it('should return "big" with matching predicate ', function(done) {

        expect(renderString('{{#any arrayWithObjs a=1}}{{big}}{{/any}}', context))
            .to.be.equal('big');

        expect(renderString('{{#any arrayWithObjs a=2}}{{big}}{{/any}}', context))
            .to.be.equal('big');

        expect(renderString('{{#any arrayWithObjs b=1}}{{big}}{{/any}}', context))
            .to.be.equal('big');

        done();
    });

    it('should return nothing without matching predicate ', function(done) {

        expect(renderString('{{#any arrayWithObjs b=2}}{{big}}{{/any}}', context))
            .to.be.equal('');

        expect(renderString('{{#any arrayWithObjs c=1}}{{big}}{{/any}}', context))
            .to.be.equal('');

        expect(renderString('{{#any arrayWithObjs num=2}}{{big}}{{/any}}', context))
            .to.be.equal('');

        done();

    });
});


describe('any helper (with multiple arguments)', function() {
    // DEPRECATED: Moved to #or helper
    var context = {
        num1: 1,
        num2: 2,
        product: {a: 1, b: 2},
        string: 'yolo',
        alwaysTrue: true,
        alwaysFalse: false,
        emptyArray: [],
        emptyObject: {},
        itemArray: [1,2],
        big: 'big',
        arrayWithObjs: [{a: 1},{b: 1},{a: 2}]
    };

    it('should return "big" if at least one arg valid', function(done) {

        expect(renderString('{{#any arrayWithObjs string}}{{big}}{{/any}}', context))
            .to.be.equal('big');

        expect(renderString('{{#any "something test" itemArray}}{{big}}{{/any}}', context))
            .to.be.equal('big');

        expect(renderString('{{#any "this is before the other test"}}{{big}}{{/any}}', context))
            .to.be.equal('big');

        expect(renderString('{{#any alwaysFalse emptyArray string}}{{big}}{{/any}}', context))
            .to.be.equal('big');

        done();

    });

    it('should return "" when no arguments are valid', function(done) {

        expect(renderString('{{#any emptyArray emptyObject alwaysFalse}}{{big}}{{/any}}', context))
            .to.be.equal('');

        expect(renderString('{{#any "" false}}{{big}}{{/any}}', context))
            .to.be.equal('');

        done();

    });
});
