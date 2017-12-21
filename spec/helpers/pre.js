var Code = require('code'),
    Lab = require('lab'),
    lab = exports.lab = Lab.script(),
    describe = lab.experiment,
    expect = Code.expect,
    it = lab.it,
    renderString = require('../spec-helpers').renderString;

describe('pre helper', function() {

    it('should render an object properly', function(done) {

        expect(renderString('{{{pre var}}}', {var: {}}))
            .to.be.equal('<pre>{}</pre>');

        done();
    });

    it('should scape html entities', function(done) {

        expect(renderString('{{{pre var}}}', {var: "<div>&\"500\"</div>"}))
            .to.be.equal('<pre>&quot;&lt;div&gt;&amp;\\&quot;500\\&quot;&lt;/div&gt;&quot;</pre>');

        done();
    });
});
