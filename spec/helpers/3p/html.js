const Code = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const expect = Code.expect;
const it = lab.it;
const describe = lab.describe

const { buildRenderer } = require('../../spec-helpers');
const renderer = buildRenderer();
const hbs = renderer.handlebars;
const helpers = require('../../../helpers/3p/html');

Object.keys(helpers).forEach(key => {
    hbs.registerHelper(key, helpers[key]);
});


var locals = {data: [{aaa: 'AAA', bbb: 'BBB'}, {aaa: 'CCC', bbb: 'DDD'}]};

describe('html', function() {
  describe('ellipsis', function() {
    it('should return an empty string if undefined', function(done) {
      var fn = hbs.compile('{{ellipsis}}');
      expect(fn()).to.equal('');
      done();
    });
    it('should return then string truncated by a specified length.', function(done) {
      var fn = hbs.compile('{{ellipsis "Bender should not be allowed on tv." 31}}');
      expect(fn()).to.equal('Bender should not be allowed on…');
      done();
    });
    it('should return the string if shorter than the specified length.', function(done) {
      var fn = hbs.compile('{{ellipsis "Bender should not be allowed on tv." 100}}');
      expect(fn()).to.equal('Bender should not be allowed on tv.');
      done();
    });
  });

  describe('sanitize', function() {
    it('should return an empty string when undefined.', function(done) {
      expect(hbs.compile('{{sanitize}}')()).to.equal('');
      done();
    });
    it('should strip html from a string.', function(done) {
      var actual = hbs.compile('{{sanitize "<span>foo</span>"}}')();
      expect(actual).to.equal('foo');
      done();
    });
  });

  describe('ul', function() {
    it('should should return an unordered list', function(done) {
      var fn = hbs.compile('{{#ul data class="names"}}{{aaa}} {{bbb}}{{/ul}}');
      expect(fn(locals)).to.equal('<ul class="names"><li>AAA BBB</li>\n<li>CCC DDD</li></ul>');
      done();
    });
  });

  describe('ol', function() {
    it('should should return an ordered list', function(done) {
      var fn = hbs.compile('{{#ol data class="names"}}{{aaa}} {{bbb}}{{/ol}}');
      expect(fn(locals)).to.equal('<ol class="names"><li>AAA BBB</li>\n<li>CCC DDD</li></ol>');
      done();
    });
  });

  describe('thumbnailImage', function() {
    describe('{{{thumbnailImage context}}}', function() {
      it('should return figure with link and caption', function(done) {
        var context = {
          data: {
            id: 'id',
            alt: 'Picture of a placeholder',
            thumbnail: 'http://placehold.it/200x200/0eafff/ffffff.png',
            size: {
              width: 200,
              height: 200
            },
            full: 'http://placehold.it/600x400/0eafff/ffffff.png',
            caption: 'My new caption!'
          }
        };
        var fn = hbs.compile('{{{thumbnailImage data}}}');
        var comparison = [
          '<figure id="image-id">',
          '<a href="http://placehold.it/600x400/0eafff/ffffff.png" rel="thumbnail">',
          '<img alt="Picture of a placeholder" src="http://placehold.it/200x200/0eafff/ffffff.png" width="200" height="200">',
          '</a>',
          '<figcaption>My new caption!</figcaption>',
          '</figure>',
        ].join('\n');
        expect(fn(context)).to.equal(comparison);
        done();
      });

      it('should return figure with extra class "test"', function(done) {
        var source = '{{{thumbnailImage data}}}';
        var context = {
          data: {
            id: 'id',
            alt: 'Picture of a placeholder',
            thumbnail: 'http://placehold.it/200x200/0eafff/ffffff.png',
            size: {
              width: 200,
              height: 200
            },
            classes: {
              figure: ['test']
            },
            full: 'http://placehold.it/600x400/0eafff/ffffff.png',
            caption: 'My new caption!'
          }
        };

        var fn = hbs.compile(source);
        var comparison = [
          '<figure id="image-id" class="test">',
          '<a href="http://placehold.it/600x400/0eafff/ffffff.png" rel="thumbnail">',
          '<img alt="Picture of a placeholder" src="http://placehold.it/200x200/0eafff/ffffff.png" width="200" height="200">',
          '</a>',
          '<figcaption>My new caption!</figcaption>',
          '</figure>'
        ].join('\n');
        expect(fn(context)).to.equal(comparison);
        done();
      });

      it('should return figure with image that has class "test"', function(done) {
        var source = '{{{thumbnailImage data}}}';
        var context = {
          data: {
            id: 'id',
            alt: 'Picture of a placeholder',
            thumbnail: 'http://placehold.it/200x200/0eafff/ffffff.png',
            size: {
              width: 200,
              height: 200
            },
            full: 'http://placehold.it/600x400/0eafff/ffffff.png',
            classes: {
              image: ['test']
            },
            caption: 'My new caption!'
          }
        };
        var fn = hbs.compile(source);
        var comparison = [
          '<figure id="image-id">',
          '<a href="http://placehold.it/600x400/0eafff/ffffff.png" rel="thumbnail">',
          '<img alt="Picture of a placeholder" src="http://placehold.it/200x200/0eafff/ffffff.png" width="200" height="200" class="test">',
          '</a>',
          '<figcaption>My new caption!</figcaption>',
          '</figure>'
        ].join('\n');
        expect(fn(context)).to.equal(comparison);
        done();
      });

      it('should return figure with link that has class "test"', function(done) {
        var source = '{{{thumbnailImage data}}}';
        var context = {
          data: {
            id: 'id',
            alt: 'Picture of a placeholder',
            thumbnail: 'http://placehold.it/200x200/0eafff/ffffff.png',
            size: {
              width: 200,
              height: 200
            },
            full: 'http://placehold.it/600x400/0eafff/ffffff.png',
            classes: {
              link: ['test']
            },
            caption: 'My new caption!'
          }
        };
        var fn = hbs.compile(source);
        var comparison = [
         '<figure id="image-id">',
         '<a href="http://placehold.it/600x400/0eafff/ffffff.png" rel="thumbnail" class="test">',
         '<img alt="Picture of a placeholder" src="http://placehold.it/200x200/0eafff/ffffff.png" width="200" height="200">',
         '</a>',
         '<figcaption>My new caption!</figcaption>',
         '</figure>',
        ].join('\n');
        expect(fn(context)).to.equal(comparison);
        done();
      });

      it('should return figure without link', function(done) {
        var source = '{{{thumbnailImage data}}}';
        var context = {
          data: {
            id: 'id',
            alt: 'Picture of a placeholder',
            thumbnail: 'http://placehold.it/200x200/0eafff/ffffff.png',
            size: {
              width: 200,
              height: 200
            },
            caption: 'My new caption!'
          }
        };
        var fn = hbs.compile(source);
        var comparison = [
          '<figure id="image-id">',
          '<img alt="Picture of a placeholder" src="http://placehold.it/200x200/0eafff/ffffff.png" width="200" height="200">',
          '<figcaption>My new caption!</figcaption>',
          '</figure>'
        ].join('\n');
        expect(fn(context)).to.equal(comparison);
        done();
      });

      it('should return figure without caption', function(done) {
        var source = '{{{thumbnailImage data}}}';
        var context = {
          data: {
            id: 'id',
            alt: 'Picture of a placeholder',
            thumbnail: 'http://placehold.it/200x200/0eafff/ffffff.png',
            size: {
              width: 200,
              height: 200
            },
            full: 'http://placehold.it/600x400/0eafff/ffffff.png'
          }
        };
        var fn = hbs.compile(source);
        var comparison = [
          '<figure id="image-id">',
          '<a href="http://placehold.it/600x400/0eafff/ffffff.png" rel="thumbnail">',
          '<img alt="Picture of a placeholder" src="http://placehold.it/200x200/0eafff/ffffff.png" width="200" height="200">',
          '</a>',
          '</figure>'
        ].join('\n');
        expect(fn(context)).to.equal(comparison);
        done();
      });
    });
  });
});