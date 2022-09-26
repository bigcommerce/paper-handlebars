/*!
 * index-of <https://github.com/jonschlinkert/index-of>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT License
 */

const Code = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const expect = Code.expect;
const it = lab.it;
const describe = lab.describe;

const indexOf = require('../../../../../helpers/3p/utils/lib/indexOf');

describe('indexOf', function () {
  it('should get the index of the given element:', function (done) {
    expect(indexOf(['a', 'b', 'c'], 'a')).to.equal(0);
    expect(indexOf(['a', 'b', 'c'], 'b')).to.equal(1);
    expect(indexOf(['a', 'b', 'c'], 'c')).to.equal(2);
    done();
  });

  it('should return -1 if fromIndex is out of range:', function (done) {
    expect(indexOf(['a', undefined, 'b', 'c', 'a'], undefined, 5)).to.equal(-1);
    done();
  });

  it('should return -1 if the element does not exist:', function (done) {
    expect(indexOf(['a', 'b', 'c'], 'd')).to.equal(-1);
    done();
  });

  it('should get the index, starting from the given index:', function (done) {
    expect(indexOf(['a', 'b', 'c', 'a', 'b', 'c'], 'b', 2)).to.equal(4);
    expect(indexOf(['a', undefined, 'b', 'c', 'a'], undefined, 0)).to.equal(1);
    expect(indexOf(['a', undefined, 'b', 'c', 'a'], undefined, 1)).to.equal(1);
    expect(indexOf(['a', undefined, 'b', 'c', 'a'], undefined, 2)).to.equal(-1);
    done();
  });
});