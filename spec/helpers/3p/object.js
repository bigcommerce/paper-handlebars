const Code = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const expect = Code.expect;
const it = lab.it;
const describe = lab.describe

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

    it('should expose `@root`:', function(done) {
      var fn = hbs.compile('{{#forIn object}}{{@root.title}}{{/forIn}}');
      expect(fn({object: {a: 1, b: 2}, title: 'x'})).to.equal('xx');
      done();
    });

    it('should not forward enclosing private variables other than `@root`, but allow `@../` scope shifts:', function(done) {
      var fn = hbs.compile('{{#each outer}}{{#forIn ../object}}<{{@index}}{{@../index}}>{{/forIn}}{{/each}}');
      expect(fn({object: {a: 1}, outer: [1, 2]})).to.equal('<0><1>');
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

    it('should expose `@root`:', function(done) {
      var fn = hbs.compile('{{#forOwn object}}{{@root.title}}{{/forOwn}}');
      expect(fn({object: {a: 1, b: 2}, title: 'x'})).to.equal('xx');
      done();
    });

    it('should not forward enclosing private variables other than `@root`, but allow `@../` scope shifts:', function(done) {
      var fn = hbs.compile('{{#each outer}}{{#forOwn ../object}}<{{@index}}{{@../index}}>{{/forOwn}}{{/each}}');
      expect(fn({object: {a: 1}, outer: [1, 2]})).to.equal('<0><1>');
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

    it('should escape HTML-unsafe characters so output is safe inside a <script> tag:', function(done) {
      var fn = hbs.compile('{{{JSONstringify data}}}');
      var res = fn({data: 'Music</script><script>alert(1)</script>'});
      expect(res).to.equal('"Music\\u003c\\u002fscript\\u003e\\u003cscript\\u003ealert(1)\\u003c\\u002fscript\\u003e"');
      expect(res).to.not.contain('</script>');
      done();
    });
  });
});

['forIn', 'forOwn'].forEach(helper => {
  describe(`${helper} @ variable boundary`, function() {
    // pierces: reaches the block body across the helper boundary.
    // blocked: must NOT reach the block body directly.
    // gotcha:  documented behaviour that may surprise.
    // l{n}:    loop marker, one per iteration, each iteration ends with a single space;
    //          nested loops list each level outer-first (l0x1:).
    const { renderString } = require('../../spec-helpers');
    const boundaryContext = {
      title: 'T',
      nested: { title: 'N' },
      outer: [1, 2],
      outerObj: {k1: 1, k2: 2},
      obj: {a: 1, b: 2},
    };
    const t = body => body.replace(/HELPER/g, helper);
    const boundaryCases = [
      { desc: 'pierces: @root from the top level',
        input: t('{{#HELPER obj}}l{{@key}}:{{@root.title}} {{/HELPER}}'), output: 'la:T lb:T ' },
      { desc: 'pierces: @root is the page, not the current context, when nested',
        input: t('{{#with nested}}{{#HELPER ../obj}}l{{@key}}:{{@root.title}} {{/HELPER}}{{/with}}'), output: 'la:T lb:T ' },
      { desc: 'pierces: own @key and hash private variables',
        input: t('{{#HELPER obj foo="y"}}l{{@key}}:{{@key}}{{@foo}} {{/HELPER}}'), output: 'la:ay lb:by ' },
      { desc: 'pierces: @../index scope shift to an enclosing #each',
        input: t('{{#each outer}}{{#HELPER ../obj}}l{{@../index}}x{{@key}}:{{@../index}} {{/HELPER}}{{/each}}'), output: 'l0xa:0 l0xb:0 l1xa:1 l1xb:1 ' },
      { desc: 'pierces: @../key scope shift to an enclosing #each over an object',
        input: t('{{#each outerObj}}{{#HELPER @root.obj}}l{{@../key}}x{{@key}}:{{@../key}} {{/HELPER}}{{/each}}'), output: 'lk1xa:k1 lk1xb:k1 lk2xa:k2 lk2xb:k2 ' },
      { desc: 'blocked: enclosing @index',
        input: t('{{#each outer}}{{#HELPER ../obj}}l{{@../index}}x{{@key}}:[{{@index}}] {{/HELPER}}{{/each}}'), output: 'l0xa:[] l0xb:[] l1xa:[] l1xb:[] ' },
      { desc: 'blocked: enclosing @first / @last',
        input: t('{{#each outer}}{{#HELPER ../obj}}l{{@../index}}x{{@key}}:[{{@first}}{{@last}}] {{/HELPER}}{{/each}}'), output: 'l0xa:[] l0xb:[] l1xa:[] l1xb:[] ' },
      { desc: 'blocked: options internals that used to leak (@data, @fn, @hash)',
        input: t('{{#HELPER obj foo="y"}}l{{@key}}:[{{@data.root.title}}{{@fn}}{{@hash.foo}}] {{/HELPER}}'), output: 'la:[] lb:[] ' },
      { desc: 'blocked: inner frame changes do not leak back out to the enclosing #each',
        input: t('{{#each outerObj}}l{{@key}}:{{#HELPER @root.obj}}{{/HELPER}}{{@key}} {{/each}}'), output: 'lk1:k1 lk2:k2 ' },
      { desc: 'gotcha: a hash arg named root shadows @root',
        input: t('{{#HELPER obj root="X"}}l{{@key}}:{{@root}} {{/HELPER}}'), output: 'la:X lb:X ' },
    ];

    ['v3', 'v4'].forEach(hbVersion => {
      boundaryCases.forEach(({ desc, input, output }) => {
        it(`${hbVersion} ${desc}`, function(done) {
          renderString(input, boundaryContext, {}, {}, undefined, hbVersion).then(result => {
            expect(result).to.equal(output);
            done();
          }).catch(done);
        });
      });
    });
  });
});
