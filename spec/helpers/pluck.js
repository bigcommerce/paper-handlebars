var Code = require('code'),
    Lab = require('lab'),
    lab = exports.lab = Lab.script(),
    describe = lab.experiment,
    expect = Code.expect,
    it = lab.it,
    renderString = require('../spec-helpers').renderString;

describe('pluck helper', function() {

    var context = {
        users: [
          { 'user': 'barney', 'age': 36 },
          { 'user': 'fred',   'age': 40 }
        ]
    };

    it('should get the values from all elements in collection', function(done) {

        expect(renderString('{{pluck users "age"}}', context))
            .to.contain('36,40');

        expect(renderString('{{#each (pluck users "user")}}hello {{this}} {{/each}}', context))
            .to.contain('hello barney hello fred ');

        done();
    });
});
