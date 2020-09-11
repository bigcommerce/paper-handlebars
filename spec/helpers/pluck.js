const Lab = require('lab'),
      lab = exports.lab = Lab.script(),
      describe = lab.experiment,
      it = lab.it,
      testRunner = require('../spec-helpers').testRunner;

describe('pluck helper', function() {
    const context = {
        users: [
          { 'user': 'barney', 'age': 36, 'image': { 'url': 'barney.jpg' } },
          { 'user': 'fred',   'age': 40, 'image': { 'url': 'fred.jpg' }  }
        ],
        user_obj: { 'user': 'fred',   'age': 40, 'image': { 'url': 'fred.jpg' }  }
    };

    const runTestCases = testRunner({context});

    it('should get the values from all elements in collection', function(done) {
        runTestCases([
            {
                input: '{{pluck users "age"}}',
                output: '36,40',
            },
            {
                input: '{{#each (pluck users "user")}}hello {{this}} {{/each}}',
                output: 'hello barney hello fred ',
            },
            {
                input: '{{pluck users "image.url"}}',
                output: 'barney.jpg,fred.jpg',
            },
            {
                input: '{{pluck users "image.alt"}}',
                output: '',
            },
            {
                input: '{{pluck "" "age"}}',
                output: '',
            },
            {
                input: '{{pluck undefined}}',
                output: '',
            },
            {
                input: '{{pluck null}}',
                output: '',
            },
            {
                input: '{{pluck}}',
                output: '',
            },
            {
                input: '{{pluck user_obj "user"}}',
                output: 'fred',
            },
            {
                input: '{{pluck user_obj "name"}}',
                output: '',
            },
            {
                input: '{{pluck user_obj "image.url"}}',
                output: 'fred.jpg',
            },
        ], done);
    });
});
