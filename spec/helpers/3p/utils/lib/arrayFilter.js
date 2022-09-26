/*
 * COPY of https://raw.githubusercontent.com/jonschlinkert/arr-filter/1.1.1/test.js
 */

const Code = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const expect = Code.expect;
const it = lab.it;
const describe = lab.describe;
const path = require('path');

const filter = require('../../../../../helpers/3p/utils/lib/arrayFilter');

describe('filter:', function () {
  it('should filter strings from the array:', function (done) {
    var actual = filter(['a', {a: 'b'}, 1, 'b', 2, {c: 'd'}, 'c'], function (ele) {
      return typeof ele === 'string';
    });
    expect(actual).to.equal(['a', 'b', 'c']);
    done();
  });

  it('should filter objects:', function (done) {
    var actual = filter(['a', {a: 'b'}, 1, 'b', 2, {c: 'd'}, 'c'], function (ele) {
      return typeof ele === 'object';
    });
    expect(actual).to.equal([{a: 'b'}, {c: 'd'}]);
    done();
  });

  it('should filter strings:', function (done) {
    function ext(extension) {
      return function(fp) {
        return path.extname(fp) === extension;
      };
    }

    expect(filter(['a/b/c.js', 'a/b/c.css'], ext('.css'))).to.equal(['a/b/c.css']);
    expect(filter(['a/b/c.js', 'a/b/c.css'], ext('.js'))).to.equal(['a/b/c.js']);
    done();
  });

  it('should throw an error when the callback is missing.', function (done) {
    expect(function() {
      filter(['a/b/c.js', 'a/b/c.css']);
    }).to.throw('arr-filter expects a callback function.');
    done();
  });
});