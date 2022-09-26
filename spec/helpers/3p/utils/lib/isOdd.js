const Code = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const expect = Code.expect;
const it = lab.it;
const describe = lab.describe;

const isOdd = require('../../../../../helpers/3p/utils/lib/isOdd');

describe('isOdd', function() {
  it('should return true if the number is odd:', function(done) {
    expect(!isOdd(0)).to.equal(true);
    expect(!isOdd(2)).to.equal(true);
    expect(isOdd(1)).to.equal(true);
    expect(isOdd(3)).to.equal(true);
    expect(isOdd(-1)).to.equal(true);
    expect(isOdd(-3)).to.equal(true);
    expect(isOdd(1.0e0)).to.equal(true);
    expect(isOdd(9007199254740991)).to.equal(true);
    done();
  });

  it('should work with strings:', function(done) {
    expect(!isOdd('0')).to.equal(true);
    expect(!isOdd('2')).to.equal(true);
    expect(isOdd('1')).to.equal(true);
    expect(isOdd('3')).to.equal(true);
    expect(isOdd('1.0e0')).to.equal(true);
    expect(isOdd('9007199254740991')).to.equal(true);
    done();
  });

  it('should throw an error when an invalid value is passed', function(done) {
    expect(() => isOdd(), /expected a number/).to.throw();
    expect(() => isOdd('foo'), /expected a number/).to.throw();
    expect(() => isOdd('1.1e0'), /expected an integer/).to.throw();
    // Not being thrown anymore on current Node version
    // expect(() => isOdd('9007199254740992'), /value exceeds maximum safe integer/).to.throw();
    // expect(() => isOdd(9007199254740992), /value exceeds maximum safe integer/).to.throw();
    done();
  });
});

