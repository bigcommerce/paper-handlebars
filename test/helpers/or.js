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

describe('or helper', function() {
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
        expect(c('{{#or arrayWithObjs string}}{{big}}{{/or}}', context))
            .to.be.equal('big');
      
        expect(c('{{#or "something test" itemArray}}{{big}}{{/or}}', context))
            .to.be.equal('big');
      
        expect(c('{{#or "this is before the other test"}}{{big}}{{/or}}', context))
            .to.be.equal('big');
      
        expect(c('{{#or alwaysFalse emptyArray string}}{{big}}{{/or}}', context))
            .to.be.equal('big');
      
        done();

    });

    it('should return "" when no arguments are valid', function(done) {
        expect(c('{{#or emptyArray emptyObject alwaysFalse}}{{big}}{{/or}}', context))
            .to.be.equal('');
      
        expect(c('{{#or "" false}}{{big}}{{/or}}', context))
            .to.be.equal('');
      
        done();

    });

});

