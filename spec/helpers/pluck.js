var Code = require('code'),
    Lab = require('lab'),
    Renderer = require('../../index'),
    lab = exports.lab = Lab.script(),
    describe = lab.experiment,
    expect = Code.expect,
    it = lab.it;

function c(template, context) {
    const renderer = new Renderer();
    return renderer.renderString(template, context);
}

describe('pluck helper', function() {

    var context = {
        users: [
          { 'user': 'barney', 'age': 36 },
          { 'user': 'fred',   'age': 40 }
        ]
    };

    it('should get the values from all elements in collection', function(done) {

        expect(c('{{pluck users "age"}}', context))
            .to.contain('36,40');

        expect(c('{{#each (pluck users "user")}}hello {{this}} {{/each}}', context))
            .to.contain('hello barney hello fred ');

        done();
    });
});
