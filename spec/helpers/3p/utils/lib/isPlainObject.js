const Code = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const expect = Code.expect;
const it = lab.it;
const describe = lab.describe;

var isPlainObject = require('../../../../../helpers/3p/utils/lib/isPlainObject');

describe('Same-Realm Server Tests', function() {
    it('should return `true` if the object is created by the `Object` constructor.', function(done) {
      expect(isPlainObject(Object.create({}))).to.equal(true);
      expect(isPlainObject(Object.create(Object.prototype))).to.equal(true);
      expect(isPlainObject({foo: 'bar'})).to.equal(true);
      expect(isPlainObject({})).to.equal(true);
      expect(isPlainObject(Object.create(null))).to.equal(true);
      done();
    });
  
    it('should return `false` if the object is not created by the `Object` constructor.', function(done) {
      function Foo() {this.abc = {};};
  
      expect(!isPlainObject(/foo/)).to.equal(true);
      expect(!isPlainObject(function() {})).to.equal(true);
      expect(!isPlainObject(1)).to.equal(true);
      expect(!isPlainObject(['foo', 'bar'])).to.equal(true);
      expect(!isPlainObject([])).to.equal(true);
      expect(!isPlainObject(new Foo)).to.equal(true);
      expect(!isPlainObject(null)).to.equal(true);
      done();
    });
  });