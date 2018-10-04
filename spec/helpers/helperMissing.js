const Code = require('code'),
      Lab = require('lab'),
      lab = exports.lab = Lab.script(),
      describe = lab.experiment,
      expect = Code.expect,
      it = lab.it,
      renderString = require('../spec-helpers').renderString;

describe('helperMissing', function() {
    it('should return empty string if the helper is missing', function(done) {
        renderString('{{thisHelperDoesNotExist}}', {}).then(result => {
            expect(result).to.be.equal('');
            done();
        });
    });
});
