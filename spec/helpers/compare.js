var Code = require('code'),
    Lab = require('lab'),
    lab = exports.lab = Lab.script(),
    describe = lab.experiment,
    expect = Code.expect,
    it = lab.it,
    renderString = require('../spec-helpers').renderString;

describe('compare helper', function() {
    var context = {
        num1: 1,
        num2: 2,
        product: {a: 1, b: 2},
        string: 'yolo'
    };

    it('should render "big" if all compares match', function(done) {

        expect(renderString('{{#compare "1" num1 operator="=="}}big{{/compare}}', context))
            .to.be.equal('big');

        expect(renderString('{{#compare 1 num1 operator="==="}}big{{/compare}}', context))
            .to.be.equal('big');

        expect(renderString('{{#compare 2 num1 operator="!=="}}big{{/compare}}', context))
            .to.be.equal('big');

        expect(renderString('{{#compare num2 num1 operator="!="}}big{{/compare}}', context))
            .to.be.equal('big');

        expect(renderString('{{#compare num2 num1 operator=">"}}big{{/compare}}', context))
            .to.be.equal('big');

        expect(renderString('{{#compare num1 num2 operator="<"}}big{{/compare}}', context))
            .to.be.equal('big');

        expect(renderString('{{#compare num2 num1 operator=">="}}big{{/compare}}', context))
            .to.be.equal('big');

        expect(renderString('{{#compare num1 num2 operator="<="}}big{{/compare}}', context))
            .to.be.equal('big');

        expect(renderString('{{#compare product "object" operator="typeof"}}big{{/compare}}', context))
            .to.be.equal('big');

        expect(renderString('{{#compare string "string" operator="typeof"}}big{{/compare}}', context))
            .to.be.equal('big');

        done();
    });

    it('should render empty for all cases', function(done) {

        expect(renderString('{{#compare "2" num1 operator="=="}}big{{/compare}}', context))
            .to.be.equal('');

        expect(renderString('{{#compare 2 num1 operator="==="}}big{{/compare}}', context))
            .to.be.equal('');

        expect(renderString('{{#compare 1 num1 operator="!=="}}big{{/compare}}', context))
            .to.be.equal('');

        expect(renderString('{{#compare num2 2 operator="!="}}big{{/compare}}', context))
            .to.be.equal('');

        expect(renderString('{{#compare num1 20 operator=">"}}big{{/compare}}', context))
            .to.be.equal('');

        expect(renderString('{{#compare 4 num2 operator="<"}}big{{/compare}}', context))
            .to.be.equal('');

        expect(renderString('{{#compare num1 40 operator=">="}}big{{/compare}}', context))
            .to.be.equal('');

        expect(renderString('{{#compare num2 num1 operator="<="}}big{{/compare}}', context))
            .to.be.equal('');

        expect(renderString('{{#compare product "string" operator="typeof"}}big{{/compare}}', context))
            .to.be.equal('');

        expect(renderString('{{#compare string "object" operator="typeof"}}big{{/compare}}', context))
            .to.be.equal('');

        done();
    });

});
