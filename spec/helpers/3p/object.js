const Code = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const expect = Code.expect;
const it = lab.it;
const describe = lab.describe

// require('should');
// var support = require('./support');
// var expected = support.expected('object');
// var helpers = require('..');
// var hbs = require('handlebars');
// helpers.object({handlebars: hbs});

const { buildRenderer } = require('../../spec-helpers');
const renderer = buildRenderer();
const hbs = renderer.handlebars;
const helpers = require('../../../helpers/3p/object');

Object.keys(helpers).forEach(key => {
  hbs.registerHelper(key, helpers[key]);
});


var context = {object: {a: 'b', c: 'd', e: 'f'}};

describe('object', function() {
  describe('extend', function() {
    it('should extend multiple objects into one:', function(done) {
      var fn = hbs.compile('{{{stringify (extend a d g)}}}');
      var actual = fn({a: {b: 'c'}, d: {e: 'f'}, g: {h: 'i'}});
      expect(actual).to.equal('{"b":"c","e":"f","h":"i"}');
      done();
    });

    it('should work as a non-helper util:', function(done) {
      var actual = helpers.extend({a: {b: 'c'}}, {d: {e: 'f'}}, {g: {h: 'i'}});
      expect(actual).to.equal({ a: { b: 'c' }, d: { e: 'f' }, g: { h: 'i' } });
      done();
    });

    it('should skip over sparse objects', function(done) {
      var actual = helpers.extend({a: {b: 'c'}}, null, {g: {h: 'i'}});
      expect(actual).to.equal({ a: { b: 'c' }, g: { h: 'i' } });
      done();
    });
  });

  describe('forIn', function() {
    it('should iterate over each property in an object:', function(done) {
      var fn = hbs.compile('{{#forIn this}} {{@key}} {{.}} {{/forIn}}');
      expect(fn(context.object)).to.equal(' a b  c d  e f ');
      done();
    });

    it('should return the inverse block if no object is passed:', function(done) {
      var fn = hbs.compile('{{#forIn}} {{.}} {{else}} Nada. {{/forIn}}');
      expect(fn(context.object)).to.equal(' Nada. ');
      done();
    });

    it('should expose private variables:', function(done) {
      var fn = hbs.compile('{{#forIn this abc=object}} {{@abc.a}} {{/forIn}}');
      expect(fn(context)).to.equal(' b ');
      done();
    });
  });

  describe('forOwn', function() {
    it('should iterate over each property in an object:', function(done) {
      var fn = hbs.compile('{{#forOwn this}} {{@key}} {{.}} {{/forOwn}}');
      expect(fn(context.object)).to.equal(' a b  c d  e f ');
      done();
    });

    it('should return the inverse block if no object is passed:', function(done) {
      var fn = hbs.compile('{{#forOwn}} {{.}} {{else}} Nada. {{/forOwn}}');
      expect(fn(context.object)).to.equal(' Nada. ');
      done();
    });

    it('should only expose "own" keys:', function(done) {
      function Foo() {
        this.a = 'b';
        this.b = 'c';
      }
      Foo.prototype.c = 'd';
      var fn = hbs.compile('{{#forOwn this}} {{.}} {{/forOwn}}');
      expect(fn(new Foo())).to.equal(' b  c ');
      done();
    });

    it('should expose private variables:', function(done) {
      var fn = hbs.compile('{{#forOwn this abc=object}} {{@abc.c}} {{/forOwn}}');
      expect(fn(context)).to.equal(' d ');
      done();
    });
  });

  describe('getObject', function() {
    it('should get an object from the context', function(done) {
      var one = hbs.compile('{{{stringify (getObject "a" this)}}}')({a: 'b'});
      expect(one).to.equal('{"a":"b"}');

      var two = hbs.compile('{{{stringify (getObject "c" this)}}}')({c: 'd'});
      expect(two).to.equal('{"c":"d"}');
      done();
    });
  });

  describe('toPath', function() {
    it('should return a path from provided arguments', function(done) {
      expect(hbs.compile('{{toPath "a" "b" "c"}}')()).to.equal('a.b.c');
      done();
    });
    it('should return a path from calculated arguments', function (done) {
      var t = hbs.compile('{{toPath "a" (add 1 1) "b"}}')();
      expect(t).to.equal('a.2.b');
      done();
    });
    it('should return a `get` compatible path', function(done) {
      var fn = hbs.compile('{{get (toPath "a" (add 1 1) "j") this}}');
      expect(fn({a: [{b: 'c', d: 'e'},{f: 'g', h: 'i'}, {j: 'k', l: 'm'}]})).to.equal('k');
      done();
    });
  });

  describe('get', function() {
    it('should get a value from the context', function(done) {
      expect(hbs.compile('{{get "a" this}}')({a: 'b'})).to.equal('b');
      expect(hbs.compile('{{get "c" this}}')({c: 'd'})).to.equal('d');
      done();
    });

    it('should get a nested value from the context', function(done) {
      var fn = hbs.compile('{{get "a.b.c.d" this}}');
      expect(fn({a: {b: {c: {d: 'e'}}}})).to.equal('e');
      done();
    });

    it('should work as a block helper', function(done) {
      var fn1 = hbs.compile('{{#get "a" this}} {{.}} {{/get}}');
      expect(fn1(context.object)).to.equal(' b ');

      var fn2 = hbs.compile('{{#get "c" this}} {{.}} {{/get}}');
      expect(fn2(context.object)).to.equal(' d ');
      done();
    });

    it('should get the inverse block if not found', function(done) {
      var fn = hbs.compile('{{#get "foo" this}} {{.}} {{else}}Nope.{{/get}}');
      expect(fn(context.object)).to.equal('Nope.');
      done();
    });
  });

  describe('hasOwn', function() {
    function Foo() {
      this.a = 'b';
      this.b = 'c';
    }
    Foo.prototype.c = 'd';

    it('should return true if object has own property:', function(done) {
      var fn = hbs.compile('{{hasOwn this "a"}}');
      expect(fn(new Foo())).to.equal('true');
      done();
    });

    it('should return false if object does not have own property:', function(done) {
      var fn = hbs.compile('{{hasOwn this "c"}}');
      expect(fn(new Foo())).to.equal('false');
      done();
    });
  });

  describe('isObject', function() {
    it('should return true if value is an object:', function(done) {
      var fn = hbs.compile('{{isObject this}}');
      expect(fn({a: 'b'})).to.equal('true');
      done();
    });

    it('should return false if value is not an object:', function(done) {
      var fn = hbs.compile('{{isObject this}}');
      expect(fn('foo')).to.equal('false');
      done();
    });
  });

  describe('merge', function() {
    it('should deeply merge objects passed on the context:', function(done) {
      var fn = hbs.compile('{{{stringify (merge a b c)}}}');
      var actual = fn({a: {one: 'two'}, b: {one: 'three'}, c: {two: 'four'}});
      expect(actual).to.equal('{"one":"three","two":"four"}');
      done();
    });
  });

  describe('parseJSON', function() {
    it('should parse a JSON string:', function(done) {
      var fn = hbs.compile('{{#JSONparse jsonString}}{{name}}{{/JSONparse}}');
      expect(fn({jsonString: "{\"name\": \"Fry\"}"})).to.equal('Fry');
      done();
    });
  });

  describe('stringify', function() {
    it('should stringify an object:', function(done) {
      var fn = hbs.compile('{{{stringify data}}}');
      var res = fn({data: {name: "Halle", age: 4, userid: "Nicole"}});
      expect(res).to.equal('{"name":"Halle","age":4,"userid":"Nicole"}');
      done();
    });
  });
});