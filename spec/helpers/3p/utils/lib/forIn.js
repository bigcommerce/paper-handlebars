const Code = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const expect = Code.expect;
const it = lab.it;
const describe = lab.describe;

const forIn = require('../../../../../helpers/3p/utils/lib/forIn');


describe('.forIn()', function() {
  it('should loop through all properties in the object.', function(done) {
    var obj = {a: 'foo', b: 'bar', c: 'baz'};
    var values = [];
    var keys = [];

    forIn(obj, function(value, key, o) {
      expect(o).to.equal(obj);
      keys.push(key);
      values.push(value);
    });

    expect(keys).to.equal(['a', 'b', 'c']);
    expect(values).to.equal(['foo', 'bar', 'baz']);
    done();
  });

  it('should break the loop early if `false` is returned.', function(done) {
    var obj = {a: 'foo', b: 'bar', c: 'baz'};
    var values = [];
    var keys = [];

    forIn(obj, function(value, key, o) {
      if (key === 'b') {
        return false;
      }
      keys.push(key);
      values.push(value);
    });
    
    expect(keys).to.equal(['a']);
    expect(values).to.equal(['foo']);
    done();
  });
});