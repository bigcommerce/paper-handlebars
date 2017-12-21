var Code = require('code'),
    Lab = require('lab'),
    lab = exports.lab = Lab.script(),
    describe = lab.experiment,
    expect = Code.expect,
    it = lab.it,
    renderString = require('../spec-helpers').renderString;

describe('dynamicComponent helper', function() {
    var templates = {
            'component/fields/one': '1{{animal}}',
            'component/fields/two': '2{{animal}}',
            'component/fields/three': '3{{animal}}',
        },
        context = {
            fields: [
                {partial: 'one', animal: 'dog'},
                {partial: 'two', animal: 'cat'},
                {partial: 'three', animal: 'mouse'},
            ],
            field: {partial: 'two', animal: 'elephant'}
        };

    it('should render all dynamic templates accordingly', function(done) {

        expect(renderString('{{#each fields}}{{dynamicComponent "component/fields"}} {{/each}}', context, {}, {}, templates))
            .to.be.equal('1dog 2cat 3mouse ');

        done();
    });
});

