const Code = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const expect = Code.expect;
const it = lab.it;
const describe = lab.describe


const { buildRenderer } = require('../../spec-helpers');
const renderer = buildRenderer();
const hbs = renderer.handlebars;
const helpers = require('../../../helpers/3p/string');

Object.keys(helpers).forEach(key => {
    hbs.registerHelper(key, helpers[key]);
});

describe('string', function() {
  describe('camelcase', function() {
    it('should return an empty string if undefined', function(done) {
      var fn = hbs.compile('{{camelcase}}');
      expect(fn()).to.equal('');
      done();
    });
    it('should return the string in camelcase', function(done) {
      var fn = hbs.compile('{{camelcase "foo bar baz qux"}}');
      expect(fn()).to.equal('fooBarBazQux');
      done();
    });
    it('should lowercase a single character', function(done) {
      expect(hbs.compile('{{camelcase "f"}}')()).to.equal('f');
      expect(hbs.compile('{{camelcase "A"}}')()).to.equal('a');
      done();
    });
  });

  describe('capitalize', function() {
    it('should return an empty string if undefined', function(done) {
      var fn = hbs.compile('{{capitalize}}');
      expect(fn()).to.equal('');
      done();
    });
    it('should capitalize a word.', function(done) {
      var fn = hbs.compile('{{capitalize "foo"}}');
      expect(fn()).to.equal('Foo');
      done();
    });
  });

  describe('capitalizeAll', function() {
    it('should return an empty string if undefined', function(done) {
      var fn = hbs.compile('{{capitalizeAll}}');
      expect(fn()).to.equal('');
      done();
    });
    it('should return the string with the every word capitalized.', function(done) {
      var fn = hbs.compile('{{capitalizeAll "bender should not bE allowed on tV"}}');
      expect(fn()).to.equal('Bender Should Not BE Allowed On TV');
      done();
    });
  });

  describe('center', function() {
    it('should return an empty string if undefined', function(done) {
      var fn = hbs.compile('{{center}}');
      expect(fn()).to.equal('');
      done();
    });
    it('should return the string centered by using non-breaking spaces.', function(done) {
      var fn = hbs.compile('{{center "Bender should not be allowed on tv." 2}}');
      expect(fn()).to.equal('&amp;nbsp;&amp;nbsp;Bender should not be allowed on tv.&amp;nbsp;&amp;nbsp;');
      done();
    });
  });

  describe('chop', function() {
    it('should return an empty string if undefined', function(done) {
      var fn = hbs.compile('{{chop}}');
      expect(fn()).to.equal('');
      done();
    });
    it('should remove non-word characters from start of string', function(done) {
      var fn = hbs.compile('{{chop "- foo bar baz"}}');
      expect(fn()).to.equal('foo bar baz');
      done();
    });
    it('should remove non-word characters from end of string', function(done) {
      var fn = hbs.compile('{{chop "foo bar baz _- "}}');
      expect(fn()).to.equal('foo bar baz');
      done();
    });
  });

  describe('dashcase', function() {
    it('should return an empty string if undefined', function(done) {
      var fn = hbs.compile('{{dashcase}}');
      expect(fn()).to.equal('');
      done();
    });
    it('should return the string in dashcase', function(done) {
      var fn = hbs.compile('{{dashcase "foo bar baz qux"}}');
      expect(fn()).to.equal('foo-bar-baz-qux');
      done();
    });
    it('should lowercase a single character', function(done) {
      expect(hbs.compile('{{dashcase "f"}}')()).to.equal('f');
      expect(hbs.compile('{{dashcase "A"}}')()).to.equal('a');
      done();
    });
  });

  describe('dotcase', function() {
    it('should return an empty string if undefined', function(done) {
      var fn = hbs.compile('{{dotcase}}');
      expect(fn()).to.equal('');
      done();
    });
    it('should return the string in dotcase', function(done) {
      var fn = hbs.compile('{{dotcase "foo bar baz qux"}}');
      expect(fn()).to.equal('foo.bar.baz.qux');
      done();
    });
    it('should lowercase a single character', function(done) {
      expect(hbs.compile('{{dotcase "f"}}')()).to.equal('f');
      expect(hbs.compile('{{dotcase "A"}}')()).to.equal('a');
      done();
    });
  });

  describe('hyphenate', function() {
    it('should return an empty string if undefined', function(done) {
      var fn = hbs.compile('{{hyphenate}}');
      expect(fn()).to.equal('');
      done();
    });
    it('should return the string with spaces replaced with hyphens.', function(done) {
      var fn = hbs.compile('{{hyphenate "Bender should not be allowed on tv."}}');
      expect(fn()).to.equal('Bender-should-not-be-allowed-on-tv.');
      done();
    });
  });

  describe('lowercase', function() {
    it('should return an empty string if undefined', function(done) {
      var fn = hbs.compile('{{lowercase}}');
      expect(fn()).to.equal('');
      done();
    });
    it('should return the string in lowercase', function(done) {
      var fn = hbs.compile('{{lowercase "BENDER SHOULD NOT BE ALLOWED ON TV"}}');
      expect(fn()).to.equal('bender should not be allowed on tv');
      done();
    });
  });

  describe('pascalcase', function() {
    it('should return an empty string if undefined', function(done) {
      var fn = hbs.compile('{{pascalcase}}');
      expect(fn()).to.equal('');
      done();
    });
    it('should return the string in pascalcase', function(done) {
      var fn = hbs.compile('{{pascalcase "foo bar baz qux"}}');
      expect(fn()).to.equal('FooBarBazQux');
      done();
    });
    it('should uppercase a single character', function(done) {
      expect(hbs.compile('{{pascalcase "f"}}')()).to.equal('F');
      expect(hbs.compile('{{pascalcase "A"}}')()).to.equal('A');
      done();
    });
  });

  describe('pathcase', function() {
    it('should return an empty string if undefined', function(done) {
      var fn = hbs.compile('{{pathcase}}');
      expect(fn()).to.equal('');
      done();
    });
    it('should return the string in pathcase', function(done) {
      var fn = hbs.compile('{{pathcase "foo bar baz qux"}}');
      expect(fn()).to.equal('foo/bar/baz/qux');
      done();
    });
    it('should lowercase a single character', function(done) {
      expect(hbs.compile('{{pathcase "f"}}')()).to.equal('f');
      expect(hbs.compile('{{pathcase "A"}}')()).to.equal('a');
      done();
    });
  });

  describe('plusify', function() {
    it('should return an empty string if undefined', function(done) {
      var fn = hbs.compile('{{plusify}}');
      expect(fn()).to.equal('');
      done();
    });
    it('should return the empty string with no change.', function(done) {
      var fn = hbs.compile('{{plusify ""}}');
      expect(fn()).to.equal('');
      done();
    });
    it('should return the string with no change.', function(done) {
      var fn = hbs.compile('{{plusify "BenderShouldNotBeAllowedOnTv."}}');
      expect(fn()).to.equal('BenderShouldNotBeAllowedOnTv.');
      done();
    });
    it('should return the string with spaces replaced with pluses.', function(done) {
      var fn = hbs.compile('{{plusify "Bender should not be allowed on tv."}}');
      expect(fn()).to.equal('Bender+should+not+be+allowed+on+tv.');
      done();
    });
  });

  describe('replace', function() {
    it('should return an empty string if undefined', function(done) {
      var fn = hbs.compile('{{replace}}');
      expect(fn()).to.equal('');
      done();
    });
    it('should replace occurrences of string "A" with string "B"', function(done) {
      var fn = hbs.compile('{{replace "Bender Bending Rodriguez" "B" "M"}}');
      expect(fn()).to.equal('Mender Mending Rodriguez');
      done();
    });
    it('should return the string if `a` is undefined', function(done) {
      var fn = hbs.compile('{{replace "a b c"}}');
      expect(fn()).to.equal('a b c');
      done();
    });
    it('should replace the string with `""` if `b` is undefined', function(done) {
      var fn = hbs.compile('{{replace "a b c" "a"}}');
      expect(fn()).to.equal(' b c');
      done();
    });
  });

  describe('reverse', function() {
    it('should return an empty string if undefined', function(done) {
      var fn = hbs.compile('{{reverse}}');
      expect(fn()).to.equal('');
      done();
    });
    it('should return the string in reverse.', function(done) {
      var fn = hbs.compile('{{reverse "bender should NOT be allowed on TV."}}');
      expect(fn()).to.equal('.VT no dewolla eb TON dluohs redneb');
      done();
    });
  });

  describe('sentence', function() {
    it('should return an empty string if undefined', function(done) {
      var fn = hbs.compile('{{sentence}}');
      expect(fn()).to.equal('');
      done();
    });
    it('should capitalize the first word of each sentence in a string and convert the rest of the sentence to lowercase.', function(done) {
      var fn = hbs.compile('{{sentence "bender should NOT be allowed on TV. fry SHOULD be allowed on TV."}}');
      expect(fn()).to.equal('Bender should not be allowed on tv. Fry should be allowed on tv.');
      done();
    });
  });

  describe('snakecase', function() {
    it('should return an empty string if undefined', function(done) {
      var fn = hbs.compile('{{snakecase}}');
      expect(fn()).to.equal('');
      done();
    });
    it('should lowercase a single character', function(done) {
      expect(hbs.compile('{{snakecase "a"}}')()).to.equal('a');
      expect(hbs.compile('{{snakecase "A"}}')()).to.equal('a');
      done();
    });
    it('should return the string in snakecase', function(done) {
      var fn = hbs.compile('{{snakecase "foo bar baz qux"}}');
      expect(fn()).to.equal('foo_bar_baz_qux');
      done();
    });
  });

  describe('split', function() {
    it('should return an empty string if undefined', function(done) {
      var fn = hbs.compile('{{split}}');
      expect(fn()).to.equal('');
      done();
    });
    it('should split the string with the default character', function(done) {
      var fn = hbs.compile('{{#each (split "a,b,c")}}<{{.}}>{{/each}}');
      expect(fn()).to.equal('<a><b><c>');
      done();
    });
    it('should split the string on the given character', function(done) {
      var fn = hbs.compile('{{#each (split "a|b|c" "|")}}<{{.}}>{{/each}}');
      expect(fn()).to.equal('<a><b><c>');
      done();
    });
  });

  describe('titleize', function() {
    it('should return an empty string if undefined', function(done) {
      var fn = hbs.compile('{{titleize}}');
      expect(fn()).to.equal('');
      done();
    });
  
    it('should return unchanged input string if string has only non-word characters', function(done) {
      var fn = hbs.compile('{{titleize ",!"}}');
      expect(fn()).to.equal(',!');
      done();
    });
  
    it('should return the string in title case.', function(done) {
      var fn = hbs.compile('{{titleize "Bender-should-Not-be-allowed_on_Tv"}}');
      expect(fn()).to.equal('Bender Should Not Be Allowed On Tv');
      done();
    });
  });

  describe('trim', function() {
    it('should return an empty string if undefined', function(done) {
      var fn = hbs.compile('{{trim}}');
      expect(fn()).to.equal('');
      done();
    });
    it('should trim leading whitespace', function(done) {
      var fn = hbs.compile('{{trim "    foo"}}');
      expect(fn()).to.equal('foo');
      done();
    });
    it('should trim trailing whitespace', function(done) {
      var fn = hbs.compile('{{trim "foo   "}}');
      expect(fn()).to.equal('foo');
      done();
    });
  });

  describe('startsWith', function() {
    it('should return an empty string if undefined', function(done) {
      var fn = hbs.compile('{{startsWith}}');
      expect(fn()).to.equal('');
      done();
    });
    it('should render "Yes he is", from inside the block.', function(done) {
      var fn = hbs.compile('{{#startsWith "Bender" "Bender is great"}}Yes he is{{/startsWith}}');
      expect(fn()).to.equal("Yes he is");
      done();
    });
    it('should render the Inverse block.', function(done) {
      var fn = hbs.compile('{{#startsWith "Goodbye" "Hello, world!"}}Whoops{{else}}Bro, do you even hello world?{{/startsWith}}');
      expect(fn()).to.equal('Bro, do you even hello world?');
      done();
    });
    it("should render the Inverse block.", function(done) {
      var fn = hbs.compile('{{#startsWith "myPrefix" nullProperty}}fn block{{else}}inverse block{{/startsWith}}');
      expect(fn()).to.equal('inverse block');
      done();
    });
  });

  describe('uppercase', function() {
    it('should return an empty string if undefined', function(done) {
      var fn = hbs.compile('{{uppercase}}');
      expect(fn()).to.equal('');
      done();
    });

    it('should return the string in uppercase', function(done) {
      var fn = hbs.compile('{{uppercase "bender should not be allowed on tv"}}');
      expect(fn()).to.equal('BENDER SHOULD NOT BE ALLOWED ON TV');
      done();
    });

    it('should work as a block helper', function(done) {
      var fn = hbs.compile('{{#uppercase}}bender should not be allowed on tv{{/uppercase}}');
      expect(fn()).to.equal('BENDER SHOULD NOT BE ALLOWED ON TV');
      done();
    });
  });
});
