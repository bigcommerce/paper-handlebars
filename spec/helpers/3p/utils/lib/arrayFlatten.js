const Code = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const expect = Code.expect;
const it = lab.it;
const describe = lab.describe;

const flatten = require('../../../../../helpers/3p/utils/lib/arrayFlatten');

describe('flatten', function() {
  it('should flatten nested arrays:', function(done) {
    expect(flatten(['a', 'b', ['c'], 'd', ['e']])).to.equal(['a', 'b', 'c', 'd', 'e']);
    done();
  });

  it('should flatten deeply nested arrays:', function(done) {
    expect(flatten(['a', [[[[[[[['b', [['c']]]]]], 'd', ['e']]]]]])).to.equal(['a', 'b', 'c', 'd', 'e']);
    expect(flatten(['a', 'b', ['c'], 'd', ['e']])).to.equal(['a', 'b', 'c', 'd', 'e']);
    expect(flatten([['a', ['b', ['k', ['a', ['b', ['c'], [['a', [['a', ['b', ['k', ['a', ['b', ['c']], ['a', ['x', ['c'], ['a', ['x', ['k']]], ['d', ['z']]]], ['d', ['m']]], ['d', ['e']]]]], ['d', ['e']]], ['b', ['k', ['a', ['b', ['c']], ['a', ['x', ['c'], ['a', ['x', ['k']]], ['d', ['z']]]], ['d', ['m']]], ['d', ['e']]]]], ['d', ['e']]]], ['a', ['x', ['c'], ['a', ['x', ['k']], [['a', ['b', ['k', ['a', ['b', ['c']], ['a', ['x', ['c'], ['a', ['x', ['k']]], ['d', ['z']]]], ['d', ['m']]], ['d', ['e']]]]], ['d', ['e']]]], ['d', ['z']]]], ['d', ['m']]], ['d', ['e']]]]], ['d', ['e']]])).to.equal([ 'a', 'b', 'k', 'a', 'b', 'c', 'a', 'a', 'b', 'k', 'a', 'b', 'c', 'a', 'x', 'c', 'a', 'x', 'k', 'd', 'z', 'd', 'm', 'd', 'e', 'd', 'e', 'b', 'k', 'a', 'b', 'c', 'a', 'x', 'c', 'a', 'x', 'k', 'd', 'z', 'd', 'm', 'd', 'e', 'd', 'e', 'a', 'x', 'c', 'a', 'x', 'k', 'a', 'b', 'k', 'a', 'b', 'c', 'a', 'x', 'c', 'a', 'x', 'k', 'd', 'z', 'd', 'm', 'd', 'e', 'd', 'e', 'd', 'z', 'd', 'm', 'd', 'e', 'd', 'e' ]);
    done();
  });
});
