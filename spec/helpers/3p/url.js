const Code = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const expect = Code.expect;
const it = lab.it;
const describe = lab.describe

const { buildRenderer } = require('../../spec-helpers');
const renderer = buildRenderer();
const hbs = renderer.handlebars;
const helpers = require('../../../helpers/3p/misc');

Object.keys(helpers).forEach(key => {
    hbs.registerHelper(key, helpers[key]);
});


describe('url', function() {
  describe('urlResolve', function() {
    it('should take a base URL, and a href URL, and resolve them as a browser would', function(done) {
      var fn = hbs.compile('{{urlResolve "/one/two/three" "four"}}');
      expect(fn()).to.equal('/one/two/four');
      done();
    });

    it('should take a base URL, and a href URL, and resolve them as a browser would', function(done) {
      var fn = hbs.compile('{{urlResolve "http://example.com/" "/one"}}');
      expect(fn()).to.equal('http://example.com/one');
      done();
    });

    it('should take a base URL, and a href URL, and resolve them as a browser would', function(done) {
      var fn = hbs.compile('{{urlResolve "http://example.com/one" "/two"}}');
      expect(fn()).to.equal('http://example.com/two');
      done();
    });
  });

  describe('encodeURI', function() {
    it('should return an encoded uri string.', function(done) {
      var fn = hbs.compile('{{encodeURI "http://example.com?comment=Thyme &time=again"}}');
      expect(fn()).to.equal('http%3A%2F%2Fexample.com%3Fcomment%3DThyme%20%26time%3Dagain');
      done();
    });
  });

  describe('decodeURI', function() {
    it('should return an decoded uri string.', function(done) {
      var fn = hbs.compile('{{{decodeURI "http%3A%2F%2Fexample.com%3Fcomment%3DThyme%20%26time%3Dagain"}}}');
      expect(fn()).to.equal('http://example.com?comment=Thyme &time=again');
      done();
    });
  });

  describe('urlParse', function() {
    it('should take a string, and return an object stringified to JSON.', function(done) {
      var fn = hbs.compile('{{{JSONstringify (urlParse "http://foo.com/bar/baz?key=value" "json")}}}');
      expect(JSON.parse(fn())).to.equal({
        "protocol": "http:",
        "slashes": true,
        "auth": null,
        "host": "foo.com",
        "port": null,
        "hostname": "foo.com",
        "hash": null,
        "search": "?key=value",
        "query": "key=value",
        "pathname": "/bar/baz",
        "path": "/bar/baz?key=value",
        "href": "http://foo.com/bar/baz?key=value"
      });
      done();
    });
  });

  describe('strip protocol', function() {
    it('should take an http url and return without the protocol', function(done) {
      var data = { testUrl: 'http://foo.bar' };
      var expectedResult = '//foo.bar/';
      var fn = hbs.compile('{{stripProtocol testUrl}}');
      expect(fn(data)).to.equal(expectedResult);
      done();
    });

    it('strip https protocol', function(done) {
      var data = { testUrl: 'https://foo.bar' };
      var expectedResult = '//foo.bar/';
      var fn = hbs.compile('{{stripProtocol testUrl}}');
      expect(fn(data)).to.equal(expectedResult);
      done();
    });

    it('should leave a relative url unchanged', function(done) {
      var testUrl = 'path/to/file';
      var data = { testUrl: testUrl };
      var fn = hbs.compile('{{stripProtocol testUrl}}');
      expect(fn(data)).to.equal(testUrl);
      done();
    });

    it('should leave an absolute url unchanged', function(done) {
      var testUrl = '/path/to/file';
      var data = { testUrl: testUrl };
      var fn = hbs.compile('{{stripProtocol testUrl}}');
      expect(fn(data)).to.equal(testUrl);
      done();
    });

  });
});