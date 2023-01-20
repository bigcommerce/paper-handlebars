const Code = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const expect = Code.expect;
const it = lab.it;
const describe = lab.describe;

var isExtendable = require('../../../../../helpers/3p/utils/lib/isExtendable');


describe('isExtendable', function() {
  it('should return true when a value is an object:', function(done) {
    expect(isExtendable({})).to.equal(true);
    expect(isExtendable([])).to.equal(true);
    expect(isExtendable(function() {})).to.equal(true);
    done();
  });

  it('should return false when a value is not an object:', function(done) {
    expect(!isExtendable(new RegExp('foo'))).to.equal(true);
    expect(!isExtendable(/foo/)).to.equal(true);
    expect(!isExtendable(new Date())).to.equal(true);
    expect(!isExtendable(new Error())).to.equal(true);
    expect(!isExtendable('a')).to.equal(true);
    expect(!isExtendable(5)).to.equal(true);
    expect(!isExtendable(null)).to.equal(true);
    expect(!isExtendable()).to.equal(true);
    expect(!isExtendable(undefined)).to.equal(true);
    expect(!isExtendable(true)).to.equal(true);
    expect(!isExtendable(false)).to.equal(true);
    done();
  });
});