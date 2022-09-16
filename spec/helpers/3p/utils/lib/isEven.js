/*!
 * https://raw.githubusercontent.com/i-voted-for-trump/is-even/0.1.2/test.js
 */

const Code = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const expect = Code.expect;
const it = lab.it;
const describe = lab.describe;

const isEven = require('../../../../../helpers/3p/utils/lib/isEven');

describe('isEven', function() {
  it('should return true if the number is odd:', function(done) {
    expect(isEven(0)).to.equal(true);
    expect(!isEven(1)).to.equal(true);
    expect(isEven(2)).to.equal(true);
    expect(!isEven(3)).to.equal(true);
    done();
  });

  it('should work with strings:', function(done) {
    expect(isEven('0')).to.equal(true);
    expect(!isEven('1')).to.equal(true);
    expect(isEven('2')).to.equal(true);
    expect(!isEven('3')).to.equal(true);
    done();
  });

  it('should throw an error on bad args:', function(done) {
    expect(function() {
      isEven();
    }, /expects a number\.$/).to.throw();
    done();
  });

  it('should throw an error on non-integer args:', function(done) {
    expect(function() {
      isEven('1.1e0');
    }, /expects an integer\.$/).to.throw();
    done();
  });
});