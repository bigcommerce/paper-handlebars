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
