const Code = require("code");
const Lab = require("lab");
const lab = (exports.lab = Lab.script());
const expect = Code.expect;
const it = lab.it;
const describe = lab.describe;

var makeIterator = require("../../../../../helpers/3p/utils/lib/makeIterator");

describe('make iterator', function() {
  it('should return source argument if it is already a function with no context', function(done) {
    var fn = function() {};
    expect(makeIterator(fn)).to.equal(fn);
    done();
  });

  it('should return a function that calls object/deepMatches if argument is an object', function(done) {
    var fn =  makeIterator({ a: 1, b: { c: 2 } });
    expect(fn({ a: 1, b: { c: 2, d: 3 } })).to.equal(true);
    expect(fn({ a: 1, b: { c: 3 } })).to.equal(false);
    done();
  });

  it('should return a function that calls object/deepMatches if argument is a regex', function(done) {
    expect(makeIterator(/[a-c]/)(['a', 'b', 'c', 'd'])).to.equal(true);
    expect(makeIterator(/[m-z]/)(['a', 'b', 'c', 'd'])).to.equal(false);
    done();
  });

  it('should return a function that returns the property value if argument is a string', function(done) {
    var fn =  makeIterator('a');
    expect(fn({a:1,b:2})).to.equal(1);
    expect(fn({a:2,b:2})).to.equal(2);
    done();
  });

  it('should return a function that returns the property value if argument is a number', function(done) {
    var fn =  makeIterator(1);
    expect(fn([0,4,5])).to.equal(4);
    expect(fn([6,7,8])).to.equal(7);
    done();
  });

  it('should return an identify function if no args', function(done) {
    var fn = makeIterator();
    expect(fn(null)).to.equal(null);
    expect(fn(void(0))).to.equal(void(0));
    expect(fn(3)).to.equal(3);
    done();
  });

  it('should return an identify function if first arg is `null`', function(done) {
    var fn = makeIterator(null);
    expect(fn(null)).to.equal(null);
    expect(fn(void(0))).to.equal(void(0));
    expect(fn(3)).to.equal(3);
    done();
  });

  it('should return a function that is called with the specified context', function(done) {
    var context = {};
    var iterator = makeIterator(function() { return this; }, context);
    expect(iterator()).to.equal(context);
    done();
  });
});