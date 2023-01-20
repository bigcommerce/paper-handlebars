/*
* COPY of https://github.com/jonschlinkert/for-own/tree/0.1.5/index.js
*/

const Code = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const expect = Code.expect;
const it = lab.it;
const describe = lab.describe;

const forOwn = require('../../../../../helpers/3p/utils/lib/forOwn');


describe('forOwn', function() {
  it('should expose keys and values from the given object', function(done) {
    var obj = {a: 'foo', b: 'bar', c: 'baz'};
    var values = [];
    var keys = [];

    forOwn(obj, function(value, key, o) {
      expect(o).to.equal(obj);
      keys.push(key);
      values.push(value);
    });

    expect(keys).to.equal(['a', 'b', 'c']);
    expect(values).to.equal(['foo', 'bar', 'baz']);
    done();
  });
});