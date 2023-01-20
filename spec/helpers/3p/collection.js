const Code = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const expect = Code.expect;
const it = lab.it;
const describe = lab.describe

const { buildRenderer } = require('../../spec-helpers');
const renderer = buildRenderer();
const hbs = renderer.handlebars;
const helpers = require('../../../helpers/3p/collection');

Object.keys(helpers).forEach(key => {
    hbs.registerHelper(key, helpers[key]);
});

var context = {array: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']};

describe('collection', function() {
  describe('isEmpty', function() {
    it('should render the first block when an array is empty.', function(done) {
      var fn = hbs.compile('{{#isEmpty array}}AAA{{else}}BBB{{/isEmpty}}');
      expect(fn({array: []})).to.equal('AAA');
      done();
    });

    it('should render the first block when the value is null.', function(done) {
      var fn = hbs.compile('{{#isEmpty}}AAA{{else}}BBB{{/isEmpty}}');
      expect(fn({array: []})).to.equal('AAA');
      done();
    });

    it('should render the second block when an array is not empty.', function(done) {
      var fn = hbs.compile('{{#isEmpty array}}AAA{{else}}BBB{{/isEmpty}}');
      expect(fn(context)).to.equal('BBB');
      done();
    });

    it('should render the second block when an object is not empty.', function(done) {
      var fn = hbs.compile('{{#isEmpty object}}AAA{{else}}BBB{{/isEmpty}}');
      expect(fn({object: {foo: 'bar'}})).to.equal('BBB');
      done();
    });

    it('should render the first block when an object is empty.', function(done) {
      var fn = hbs.compile('{{#isEmpty object}}AAA{{else}}BBB{{/isEmpty}}');
      expect(fn({object: {}})).to.equal('AAA');
      done();
    });
  });

  describe('iterate', function() {
    describe('object', function() {
      it('should iterate over a plain object:', function(done) {
        var obj = {a: 'aaa', b: 'bbb', c: 'ccc'};

        var fn = hbs.compile('{{#iterate obj}}{{.}}{{/iterate}}');
        expect(fn({obj: obj})).to.equal('aaabbbccc');
        done();
      });

      it('should expose `@key`:', function(done) {
        var obj = {a: 'aaa', b: 'bbb', c: 'ccc'};

        var fn = hbs.compile('{{#iterate obj}}{{@key}}{{/iterate}}');
        expect(fn({obj: obj})).to.equal('abc');
        done();
      });

      it('should render the inverse block when falsey:', function(done) {
        var fn = hbs.compile('{{#iterate obj}}A{{else}}B{{/iterate}}');
        expect(fn()).to.equal('B');
        done();
      });
    });

    describe('array', function() {
      it('should iterate over an array:', function(done) {
        var arr = [{name: 'a'}, {name: 'b'}, {name: 'c'}];

        var fn = hbs.compile('{{#iterate arr}}{{name}}{{/iterate}}');
        expect(fn({arr: arr})).to.equal('abc');
        done();
      });

      it('should expose `@index`:', function(done) {
        var arr = [{name: 'a'}, {name: 'b'}, {name: 'c'}];

        var fn = hbs.compile('{{#iterate arr}}{{@index}}{{/iterate}}');
        expect(fn({arr: arr})).to.equal('012');
        done();
      });
    });
  });

  describe('length', function() {
    it('should return the length of the array', function(done) {
      var fn = hbs.compile('{{length array}}');
      expect(fn(context)).to.equal('8');
      done();
    });

    it('should return an empty string when undefined.', function(done) {
      expect(hbs.compile('{{length}}')()).to.equal('');
      done();
    });

    it('should return empty strig when the value is null.', function(done) {
      var fn = hbs.compile('{{length foo}}');
      expect(fn({foo: null})).to.equal('');
      done();
    });

    it('should return the length of a string.', function(done) {
      var fn = hbs.compile('{{length "foo"}}');
      expect(fn(context)).to.equal('3');
      done();
    });

    it('should parse an array passed as a string', function(done) {
      var fn = hbs.compile('{{length \'["b", "c", "a"]\'}}');
      expect(fn(context)).to.equal('3');
      done();
    });

    it('should return 0 when the array is invalid:', function(done) {
      var fn = hbs.compile('{{length \'["b", "c", "a"\'}}');
      expect(fn(context)).to.equal('0');
      done();
    });

    it('should return 0 when the value is not an array:', function(done) {
      var fn = hbs.compile('{{length foo}}');
      expect(fn({foo: {}})).to.equal('0');
      done();
    });
  });
});