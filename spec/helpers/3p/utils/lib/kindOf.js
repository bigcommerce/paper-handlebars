/*!
 * kind-of <https://github.com/jonschlinkert/kind-of>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License
 */

const Code = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const expect = Code.expect;
const it = lab.it;
const describe = lab.describe;

var kindOf = require('../../../../../helpers/3p/utils/lib/kindOf');

var version = process.version.match(/^.(\d+)\.(\d+)/);
var major = version[1];
var minor = version[2];

describe('kindOf', function () {
  describe('null and undefined', function () {
    it('should work for undefined', function (done) {
      expect(kindOf(undefined)).to.equal('undefined');
      done();
    });

    it('should work for null', function (done) {
      expect(kindOf(null)).to.equal('null');
      done();
    });
  });

  describe('primitives', function () {
    it('should work for booleans', function (done) {
      expect(kindOf(true)).to.equal('boolean');
      expect(kindOf(false)).to.equal('boolean');
      expect(kindOf(new Boolean(true))).to.equal('boolean');
      done();
    });

    it('should work for numbers', function (done) {
      expect(kindOf(42)).to.equal('number');
      expect(kindOf(new Number(42))).to.equal('number');
      done();
    });

    it('should work for strings', function (done) {
      expect(kindOf('str')).to.equal('string');
      expect(kindOf(new String('str'))).to.equal('string');
      done();
    });
  });

  describe('objects', function () {
    it('should work for arguments', function (done) {
      (function () {
        expect(kindOf(arguments)).to.equal('arguments');
        done();
      })();
    });

    it('should work for buffers', function (done) {
      expect(kindOf(new Buffer(''))).to.equal('buffer');
      done();
    });

    it('should work for objects', function (done) {
      function Test() {}
      var instance = new Test();
      var literal = {};
      var create = Object.create(null);

      expect(kindOf(instance)).to.equal('object');
      expect(kindOf(literal)).to.equal('object');
      expect(kindOf(create)).to.equal('object');
      done();
    });

    it('should work for dates', function (done) {
      expect(kindOf(new Date())).to.equal('date');
      done();
    });

    it('should work for arrays', function (done) {
      expect(kindOf([])).to.equal('array');
      expect(kindOf([1, 2, 3])).to.equal('array');
      expect(kindOf(new Array())).to.equal('array');
      done();
    });

    it('should work for regular expressions', function (done) {
      expect(kindOf(/[\s\S]+/)).to.equal('regexp');
      expect(kindOf(new RegExp('^' + 'foo$'))).to.equal('regexp');
      done();
    });

    it('should work for functions', function (done) {
      expect(kindOf(function () {})).to.equal('function');
      expect(kindOf(new Function())).to.equal('function');
      done();
    });
  });
  if (major > 0 || minor > 11) {
    describe('es6 features', function () {
      it('should work for Map', function (done) {
        var map = new Map();
        expect(kindOf(map)).to.equal('map');
        expect(kindOf(map.set)).to.equal('function');
        expect(kindOf(map.get)).to.equal('function');
        expect(kindOf(map.add)).to.equal('undefined');
        done();
      });

      it('should work for WeakMap', function (done) {
        var weakmap = new WeakMap();
        expect(kindOf(weakmap)).to.equal('weakmap');
        expect(kindOf(weakmap.set)).to.equal('function');
        expect(kindOf(weakmap.get)).to.equal('function');
        expect(kindOf(weakmap.add)).to.equal('undefined');
        done();
      });

      it('should work for Set', function (done) {
        var set = new Set();
        expect(kindOf(set)).to.equal('set');
        expect(kindOf(set.add)).to.equal('function');
        expect(kindOf(set.set)).to.equal('undefined');
        expect(kindOf(set.get)).to.equal('undefined');
        done();
      });

      it('should work for WeakSet', function (done) {
        var weakset = new WeakSet();
        expect(kindOf(weakset)).to.equal('weakset');
        expect(kindOf(weakset.add)).to.equal('function');
        expect(kindOf(weakset.set)).to.equal('undefined');
        expect(kindOf(weakset.get)).to.equal('undefined');
        done();
      });

      it('should work for Symbol', function (done) {
        expect(kindOf(Symbol('foo'))).to.equal('symbol');
        expect(kindOf(Symbol.prototype)).to.equal('symbol');
        done();
      });
    });
  }
});