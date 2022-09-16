const Code = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const expect = Code.expect;
const it = lab.it;
const describe = lab.describe;

const createFrame = require('../../../../../helpers/3p/utils/lib/createFrame');

var hbs = require('@bigcommerce/handlebars-v4');

describe('createFrame', function () {
  it('should create a reference to _parent:', function (done) {
    var obj = createFrame({});
    expect(obj.hasOwnProperty('_parent')).to.equal(true);
    done();
  });

  it('should expose a non-enumerable `extend` method:', function (done) {
    var obj = createFrame({});
    expect(typeof obj.extend).to.equal('function');
    done();
  });

  it('should extend the frame object with the `extend` method:', function (done) {
    var obj = createFrame({});
    obj.extend({a: 'aaa'});
    obj.extend({b: 'bbb'});
    expect(obj.hasOwnProperty('a')).to.equal(true);
    expect(obj.hasOwnProperty('b')).to.equal(true);
    done();
  });

  it('should extend the frame object with additional objects:', function (done) {
    var obj = createFrame({}, {a: 'aaa'}, {b: 'bbb'});
    expect(obj.hasOwnProperty('a')).to.equal(true);
    expect(obj.hasOwnProperty('b')).to.equal(true);
    done();
  });

  it('should work with sparse arguments:', function (done) {
    var obj = createFrame({}, undefined, {b: 'bbb'});
    expect(obj.hasOwnProperty('b')).to.equal(true);
    done();
  });

  it('should add private variables when passed to `options.fn()`:', function (done) {
    var tmpl = '{{#foo}}{{@a}}{{@b}}{{/foo}}';

    hbs.registerHelper('foo', function (context) {
      var frame = createFrame(context.data);
      frame.extend({a: 'aaa'});
      frame.extend({b: 'bbb'});
      return context.fn(context, {data: frame});
    });
    var fn = hbs.compile(tmpl);
    expect(fn({})).to.equal('aaabbb');
    done();
  });

  it('should create private variables from options hash properties', function (done) {
    var tmpl = '{{#foo options target=xxx}}{{@a}}{{@b}}{{log}}{{@target.yyy}}{{/foo}}';
    var context = {
      options: {data: {eee: 'fff'} },
      xxx: {yyy: 'zzz'}
    };
    hbs.registerHelper('foo', function (context, options) {
      var frame = createFrame(context.data);
      frame.extend({a: 'aaa'});
      frame.extend({b: 'bbb'});
      frame.extend(options.hash);
      return options.fn(context, {data: frame});
    });

    var fn = hbs.compile(tmpl);
    expect(fn(context)).to.equal('aaabbbzzz');
    done();
  });

  it('should throw an error if args are invalid:', function (done) {
    expect(function () {
      createFrame();
    }, /createFrame expects data to be an object/).to.throw();
    done();
  });
});