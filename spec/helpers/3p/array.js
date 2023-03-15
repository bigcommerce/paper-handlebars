/**
 * https://github.com/helpers/handlebars-helpers/blob/0.8.4/test/array.js
 */

const Code = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const expect = Code.expect;
const it = lab.it;
const describe = lab.describe

const { buildRenderer } = require('../../spec-helpers');
const renderer = buildRenderer();
const hbs = renderer.handlebars;
const helpers = require('../../../helpers/3p/array');

Object.keys(helpers).forEach(key => {
    hbs.registerHelper(key, helpers[key]);
})


var context = {
  array: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'],
  notArray: null,
};

describe('array', function() {
  describe('after', function() {
    it('should return an empty string when undefined.', function(done) {
      expect(hbs.compile('{{after}}')()).to.equal('');
      done();
    });

    it('should return all of the items in an array after the given index.', function(done) {
      var fn = hbs.compile('{{after array 5}}');
      expect(fn(context)).to.equal(['f', 'g', 'h'].toString());
      done();
    });

    it('should return all of the items in an array after the specified count.', function(done) {
      var fn = hbs.compile('{{after notArray 5}}');
      expect(fn(context)).to.equal('');
      done();
    });
  
    it('should return all of the items in an array after the specified count.', function(done) {
      var fn = hbs.compile('{{after array 5}}');
      expect(fn(context)).to.equal(['f', 'g', 'h'].toString());
      done();
    });
  });

  describe('arrayify', function() {
    it('should arrayify a value.', function(done) {
      expect(hbs.compile('{{#each (arrayify .)}}{{.}}{{/each}}')('foo')).to.equal('foo');
      expect(hbs.compile('{{#each (arrayify .)}}{{.}}{{/each}}')(['foo'])).to.equal('foo');
      done();
    });
  });

  describe('before', function() {
    it('should return an empty string when undefined.', function(done) {
      expect(hbs.compile('{{before}}')()).to.equal('');
      done();
    });
    it('should return all of the items in an array before the given index.', function(done) {
      var fn = hbs.compile('{{before array 5}}');
      expect(fn(context)).to.equal(['a', 'b', 'c'].toString());
      done();
    });

    it('should return all of the items in an array before the specified count.', function(done) {
      var fn = hbs.compile('{{before array 5}}');
      expect(fn(context)).to.equal(['a', 'b', 'c'].toString());
      done();
    });
  });

  describe('each', function() {
    it('should use the key and value of each property in an object inside a block.', function(done) {
      var fn = hbs.compile('{{#each obj}}{{@key}}: {{this}} {{/each}}');
      expect(fn({obj: {fry: 3, bender: 120 }})).to.equal('fry: 3 bender: 120 ');
      done();
    });
  });

  describe('eachIndex', function() {
    it('should render the block using the array and each item\'s index.', function(done) {
      var fn = hbs.compile('{{#eachIndex array}} {{item}} is {{index}} {{/eachIndex}}');
      expect(fn(context)).to.equal(' a is 0  b is 1  c is 2  d is 3  e is 4  f is 5  g is 6  h is 7 ');
      done();
    });

    it('should render the block when non array is passed returning empty string', function(done) {
      var fn = hbs.compile('{{#eachIndex notArray}} {{item}} is {{index}} {{/eachIndex}}');
      expect(fn(context)).to.equal('');
      done();
    });
  });

  describe('first', function() {
    it('should return the first item in a collection.', function(done) {
      var fn = hbs.compile('{{first foo}}');
      expect(fn({foo: ['a', 'b', 'c']})).to.equal('a');
      done();
    });

    it('should return an array with the first two items in a collection.', function(done) {
      var fn = hbs.compile('{{first foo 2}}');
      expect(fn({foo: ['a', 'b', 'c']})).to.equal(['a', 'b'].toString());
      done();
    });

    it('should return an empty string when undefined.', function(done) {
        expect(hbs.compile('{{first}}')()).to.equal('');
        done();
    });

    it('should return the first item in an array.', function(done) {
      var fn = hbs.compile('{{first foo}}');
      expect(fn({foo: ['a', 'b', 'c']})).to.equal('a');
      done();
    });

    it('should return an array with the first two items in an array.', function(done) {
      var fn = hbs.compile('{{first foo 2}}');
      expect(fn({foo: ['a', 'b', 'c']})).to.equal(['a', 'b'].toString());
      done();
    });
  });

  describe('filter', function() {
    it('should render the block if the given string is in the array.', function(done) {
      var source = '{{#filter array "d"}}AAA{{else}}BBB{{/filter}}';
      expect(hbs.compile(source)(context)).to.equal('AAA');
      done();
    });

    it('should render the inverse block if the string is not in the array:', function(done) {
      var source = '{{#filter array "foo"}}AAA{{else}}BBB{{/filter}}';
      expect(hbs.compile(source)(context)).to.equal('BBB');
      done();
    });

    it('should render a block for each object that has a "first" property with the value "d".', function(done) {

      var ctx = {
        collection: [
          {first: 'aaa', last: 'bbb'},
          {first: 'b'},
          {title: 'ccc', last: 'ddd'},
          {first: 'd'},
          {first: 'eee', last: 'fff'},
          {first: 'f'},
          {title: 'ggg', last: 'hhh'},
          {first: 'h'}
        ]
      };

      var source = '{{#filter collection "d" property="first"}}{{this.first}}{{else}}ZZZ{{/filter}}';
      var fn = hbs.compile(source);
      expect(fn(ctx)).to.equal('d');
      done();
    });
  });

  describe('forEach', function() {
    it('should iterate over an array, exposing objects as context.', function(done) {
      var arr = [{name: 'a'}, {name: 'b'}, {name: 'c'}];

      var fn = hbs.compile('{{#forEach arr}}{{name}}{{/forEach}}');
      expect(fn({arr: arr})).to.equal('abc');
      done();
    });

    it('should expose `index`', function(done) {
      var arr = [{name: 'a'}, {name: 'b'}, {name: 'c'}];

      var fn = hbs.compile('{{#forEach arr}}{{index}}{{/forEach}}');
      expect(fn({arr: arr})).to.equal('123');
      done();
    });

    it('should expose `total`', function(done) {
      var arr = [{name: 'a'}, {name: 'b'}, {name: 'c'}];

      var fn = hbs.compile('{{#forEach arr}}{{total}}{{/forEach}}');
      expect(fn({arr: arr})).to.equal('333');
      done();
    });

    it('should expose `isFirst`', function(done) {
      var arr = [{name: 'a'}, {name: 'b'}, {name: 'c'}];

      var fn = hbs.compile('{{#forEach arr}}{{isFirst}}{{/forEach}}');
      expect(fn({arr: arr})).to.equal('truefalsefalse');
      done();
    });

    it('should expose `isLast`', function(done) {
      var arr = [{name: 'a'}, {name: 'b'}, {name: 'c'}];

      var fn = hbs.compile('{{#forEach arr}}{{isLast}}{{/forEach}}');
      expect(fn({arr: arr})).to.equal('falsefalsetrue');
      done();
    });

    it('should return empty block', function(done) {
      let arr = [];
      var fn = hbs.compile('{{#forEach arr}}{{isLast}}{{/forEach}}');
      expect(fn({arr})).to.equal('');

      arr = null;
      var fn = hbs.compile('{{#forEach arr}}{{isLast}}{{/forEach}}');
      expect(fn({arr})).to.equal('');
      done();
    });
  });

  describe('inArray', function() {
    it('should render the first block when a value exists in the array.', function(done) {
      var fn = hbs.compile('{{#inArray array "d"}}AAA{{else}}BBB{{/inArray}}');
      expect(fn(context)).to.equal('AAA');
      done();
    });

    it('should render the inverse block when a value does not exist.', function(done) {
      var fn = hbs.compile('{{#inArray array "foo"}}AAA{{else}}BBB{{/inArray}}');
      expect(fn(context)).to.equal('BBB');
      done();
    });
  });

  describe('isArray', function() {
    it('should return true if the value is an array.', function(done) {
      expect(hbs.compile('{{isArray "foo"}}')()).to.equal('false');
      expect(hbs.compile('{{isArray \'["foo"]\'}}')()).to.equal('false');
      expect(hbs.compile('{{isArray foo}}')({foo: ['foo']})).to.equal('true');
      expect(hbs.compile('{{isArray (arrayify "foo")}}')()).to.equal('true');
      expect(hbs.compile('{{isArray (arrayify ["foo"])}}')()).to.equal('true');
      done();
    });
  });

  describe('lengthEqual', function() {
    it('should render the first block if length is the given number', function(done) {
      var fn = hbs.compile('{{#lengthEqual array 8}}AAA{{else}}BBB{{/lengthEqual}}');
      expect(fn(context)).to.equal('AAA');
      done();
    });

    it('should render the inverse block if length is not the given number', function(done) {
      var fn = hbs.compile('{{#lengthEqual array 3}}AAA{{else}}BBB{{/lengthEqual}}');
      expect(fn(context)).to.equal('BBB');
      done();
    });
  });

  describe('map', function() {
    it('should return an empty string when undefined.', function(done) {
      expect(hbs.compile('{{map}}')()).to.equal('');
      done();
    });

    it('should map the items in the array and return new values.', function(done) {
      var o = {array: ['a', 'b', 'c']};
      o.double = function(str) {
        return str + str;
      };
      var fn = hbs.compile('{{map array double}}');
      expect(fn(o)).to.equal('aa,bb,cc');
      done();
    });

    it('should work with a string value:', function(done) {
      var o = {};
      o.double = function(str) {
        return str + str;
      };
      var fn = hbs.compile('{{map \'["a","b","c"]\' double}}');
      expect(fn(o)).to.equal('aa,bb,cc');
      done();
    });

    it('should return an empty string when the array syntax is invalid:', function(done) {
      var fn = hbs.compile('{{map \'["b", "c", "a"\'}}');
      expect(fn(context)).to.equal('');
      done();
    });
  });

  describe('some', function() {
    it('should render the first block if the callback returns true', function(done) {
      var ctx = {array: ['a', 'b', 'c']};
      ctx.isString = function(val) {
        return typeof val === 'string';
      };
      var fn = hbs.compile('{{#some array isString}}AAA{{else}}BBB{{/some}}');
      expect(fn(ctx)).to.equal('AAA');
      done();
    });

    it('should render the inverse block if the array is undefined', function(done) {
      var fn = hbs.compile('{{#some array isString}}AAA{{else}}BBB{{/some}}');
      expect(fn()).to.equal('BBB');
      done();
    });

    it('should render the inverse block if falsey', function(done) {
      var ctx = {array: [['a'], ['b'], ['c']]};
      ctx.isString = function(val) {
        return typeof val === 'string';
      };
      var fn = hbs.compile('{{#some array isString}}AAA{{else}}BBB{{/some}}');
      expect(fn(ctx)).to.equal('BBB');
      done();
    });
  });

  describe('sort', function() {
    it('should return an empty string when an invalid value is passed:', function(done) {
      var fn = hbs.compile('{{sort}}');
      var res = fn();
      expect(res).to.equal('');
      done();
    });

    it('should sort the items in the array', function(done) {
      var fn = hbs.compile('{{sort array}}');
      var res = fn({array: ['c', 'a', 'b']});
      expect(res).to.equal('a,b,c');
      done();
    });

    it('should return all items in an array sorted in lexicographical order.', function(done) {
      var fn = hbs.compile('{{sort array}}');
      expect(fn(context)).to.equal(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].toString());
      done();
    });

    it('should sort the items in the array in reverse order:', function(done) {
      var fn = hbs.compile('{{sort array reverse="true"}}');
      var res = fn({array: ['c', 'a', 'b']});
      expect(res).to.equal('c,b,a');
      done();
    });
  });

  describe('sortBy', function() {
    it('should return an empty string when undefined.', function(done) {
      expect(hbs.compile('{{sortBy}}')()).to.equal('');
      done();
    });

    it('should sort the items in an array.', function(done) {
      var fn = hbs.compile('{{sortBy \'["b", "c", "a"]\'}}');
      expect(fn(context)).to.equal('a,b,c');
      done();
    });

    it('should return an empty string when the array is invalid:', function(done) {
      var fn = hbs.compile('{{sortBy \'["b", "c", "a"\'}}');
      expect(fn(context)).to.equal('');
      done();
    });

    it('should take a compare function.', function(done) {
      var o = {};
      o.compare = function(a, b) {
        return b.localeCompare(a);
      };
      var fn = hbs.compile('{{sortBy \'["b", "c", "a"]\' compare}}');
      expect(fn(o)).to.equal('c,b,a');
      done();
    });
    
    it('should sort based on object key:', function(done) {
      var ctx = {arr: [{a: 'zzz'}, {a: 'aaa'}]};

      const helpers = require('../../../helpers/3p/object');

      Object.keys(helpers).forEach(key => {
          hbs.registerHelper(key, helpers[key]);
      })
      var fn = hbs.compile('{{{stringify (sortBy arr "a") 0}}}');
      expect(fn(ctx)).to.equal('[{"a":"aaa"},{"a":"zzz"}]');
      done();
    });
  });

  describe('withAfter', function() {
    it('should use all of the items in an array after the specified count.', function(done) {
      var fn = hbs.compile('{{#withAfter array 5}}<{{this}}>{{/withAfter}}');
      expect(fn(context)).to.equal('<f><g><h>');
      done();
    });
  });

  describe('withBefore', function() {
    it('should use all of the items in an array before the specified count.', function(done) {
      var fn = hbs.compile('{{#withBefore array 5}}<{{this}}>{{/withBefore}}');
      expect(fn(context)).to.equal('<a><b><c>');
      done();
    });
  });

  describe('withFirst', function() {
    it('should use the first item in an array.', function(done) {
      var fn = hbs.compile('{{#withFirst array}}{{this}} is smart.{{/withFirst}}');
      expect(fn(context)).to.equal('a is smart.');
      done();
    });
    it('should return an empty string when no array is passed:', function(done) {
      expect(hbs.compile('{{#withFirst}}{{/withFirst}}')()).to.equal('');
      done();
    });
    it('should return an empty string when no array is passed:', function(done) {
      const customContext = { array: null };
      var fn = hbs.compile('{{#withFirst array}}{{/withFirst}}');
      expect(fn(customContext)).to.equal('');
      done();
    });
    it('should use the first two items in an array.', function(done) {
      var fn = hbs.compile('{{#withFirst array 2}}{{this}} is smart.{{/withFirst}}');
      expect(fn(context)).to.equal('a is smart.b is smart.');
      done();
    });
  });

  describe('withLast', function() {
    it('should return an empty string when undefined.', function(done) {
      expect(hbs.compile('{{withLast}}')()).to.equal('');
      done();
    });
    it('should use the last item in an array.', function(done) {
      var fn = hbs.compile('{{#withLast array}}{{this}} is dumb.{{/withLast}}');
      expect(fn(context)).to.equal('h is dumb.');
      done();
    });
    it('should use the last two items in an array.', function(done) {
      var fn = hbs.compile('{{#withLast array 2}}{{this}} is dumb.{{/withLast}}');
      expect(fn(context)).to.equal('g is dumb.h is dumb.');
      done();
    });
  });

  describe('withSort', function() {
    it('should return an empty string when array is undefined', function(done) {
      var fn = hbs.compile('{{#withSort}}{{this}}{{/withSort}}');
      expect(fn(context)).to.equal('');
      done();
    });

    it('should sort the array in lexicographical order', function(done) {
      var fn = hbs.compile('{{#withSort array}}{{this}}{{/withSort}}');
      expect(fn(context)).to.equal('abcdefgh');
      done();
    });

    it('should sort the array in reverse order', function(done) {
      var fn = hbs.compile('{{#withSort array reverse="true"}}{{this}}{{/withSort}}');
      expect(fn(context)).to.equal('hgfedcba');
      done();
    });

    it('should sort the array by deliveries', function(done) {
      var fn = hbs.compile('{{#withSort collection "deliveries"}}{{name}}: {{deliveries}} <br>{{/withSort}}');
      var res = fn({
        collection: [
          {name: 'f', deliveries: 8021 },
          {name: 'b', deliveries: 239 },
          {name: 'd', deliveries: -12 }
        ]
      });
      expect(res).to.equal('d: -12 <br>b: 239 <br>f: 8021 <br>');
      done();
    });

    it('should sort the array by deliveries in reverse order', function(done) {
      var fn = hbs.compile('{{#withSort collection "deliveries" reverse="true"}}{{name}}: {{deliveries}} <br>{{/withSort}}');
      var res = fn({
        collection: [
          {name: 'f', deliveries: 8021 },
          {name: 'b', deliveries: 239 },
          {name: 'd', deliveries: -12 }
        ]
      });
      expect(res).to.equal('f: 8021 <br>b: 239 <br>d: -12 <br>');
      done();
    });
  });
});