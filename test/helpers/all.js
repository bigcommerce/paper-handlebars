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

describe('all helper', function() {
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
        emptyString: "",
        big: 'big'
    };

    it('(with single argument) should behave like if helper', function(done) {
        expect(c('{{#all 1}}{{big}}{{/all}}', context))
            .to.be.equal('big');

        expect(c('{{#all 1}}big{{/all}}', context))
            .to.be.equal('big');

        expect(c('{{#all "x"}}big{{/all}}', context))
            .to.be.equal('big');

        expect(c('{{#all ""}}big{{/all}}', context))
            .to.be.equal('');

        expect(c('{{#all 0}}big{{/all}}', context))
            .to.be.equal('');

        expect(c('{{#all ""}}big{{else}}small{{/all}}', context))
            .to.be.equal('small');

        expect(c('{{#all 0}}big{{else}}small{{/all}}', context))
            .to.be.equal('small');

        expect(c('{{#all num2}}big{{else}}small{{/all}}', context))
            .to.be.equal('big');

        expect(c('{{#all product}}big{{else}}small{{/all}}', context))
            .to.be.equal('big');

        expect(c('{{#all itemArray}}big{{else}}small{{/all}}', context))
            .to.be.equal('big');

        expect(c('{{#all string}}big{{else}}small{{/all}}', context))
            .to.be.equal('big');

        expect(c('{{#all emptyObject}}big{{else}}small{{/all}}', context))
            .to.be.equal('small');

        done();
    });

    it('should render "big" if all conditions truthy', function(done) {

        expect(c('{{#all "1" true}}big{{/all}}', context))
            .to.be.equal('big');

        expect(c('{{#all 1 "1"}}big{{/all}}', context))
            .to.be.equal('big');

        expect(c('{{#all "text" alwaysTrue}}big{{/all}}', context))
            .to.be.equal('big');

        expect(c('{{#all alwaysTrue product num1 num2}}big{{/all}}', context))
            .to.be.equal('big');

        expect(c('{{#all alwaysTrue itemArray string}}big{{/all}}', context))
            .to.be.equal('big');

        done();
    });

    it('should render empty if any condition is falsy', function(done) {

        expect(c('{{#all emptyString num1}}big{{/all}}', context))
            .to.be.equal('');

        expect(c('{{#all true 0 emptyArray alwaysTrue}}big{{/all}}', context))
            .to.be.equal('');

        expect(c('{{#all true "" alwaysTrue}}big{{/all}}', context))
            .to.be.equal('');

        done();
    });


});
