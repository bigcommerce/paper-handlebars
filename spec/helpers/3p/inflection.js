const Code = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const expect = Code.expect;
const it = lab.it;
const describe = lab.describe

const { buildRenderer } = require('../../spec-helpers');
const renderer = buildRenderer();
const hbs = renderer.handlebars;
const helpers = require('../../../helpers/3p/inflection');

Object.keys(helpers).forEach(key => {
    hbs.registerHelper(key, helpers[key]);
});

describe('inflection', function() {
  describe('inflect', function() {
    it('should return the plural or singular form of a word based on a value.', function(done) {
      var template = hbs.compile('{{inflect mail "junk" "mail"}}');
      expect(template({mail: 3})).to.equal('mail');
      done();
    });

    it('should return the plural or singular form of a word based on a value and include the count.',  function(done) {
      var template = hbs.compile('{{inflect messages "message" "messages" true}}');
      expect(template({messages: 1})).to.equal('1 message');
      done();
    });
  });

  describe('ordinalize', function() {
    it('should return an ordinalized string.', function(done) {
      expect(hbs.compile('{{ordinalize 1}}')()).to.equal('1st');
      expect(hbs.compile('{{ordinalize 3}}')()).to.equal('3rd');
      expect(hbs.compile('{{ordinalize 11}}')()).to.equal('11th');
      expect(hbs.compile('{{ordinalize 21}}')()).to.equal('21st');
      expect(hbs.compile('{{ordinalize 29}}')()).to.equal('29th');
      expect(hbs.compile('{{ordinalize 22}}')()).to.equal('22nd');
      done();
    });
  });
});