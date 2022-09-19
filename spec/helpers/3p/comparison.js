const Code = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const expect = Code.expect;
const it = lab.it;
const describe = lab.describe

const { buildRenderer } = require('../../spec-helpers');
const renderer = buildRenderer();
const hbs = renderer.handlebars;
const helpers = require('../../../helpers/3p/comparison');

Object.keys(helpers).forEach(key => {
    hbs.registerHelper(key, helpers[key]);
});

describe('comparison', function() {
  describe('and', function() {
    it('should render a block if both values are truthy.', function(done) {
      var fn = hbs.compile('{{#and great magnificent}}A{{else}}B{{/and}}');
      expect(fn({great: true, magnificent: true})).to.equal('A');
      done();
    });

    it('should render the inverse block if both values are not truthy.', function(done) {
      var fn = hbs.compile('{{#and great magnificent}}A{{else}}B{{/and}}');
      expect(fn({great: true, magnificent: false})).to.equal('B');
      done();
    });
  });

  describe('compare', function() {
    describe('errors', function() {
      it('should throw an error when args are invalid', function(done) {
        expect(function() {
          hbs.compile('{{#compare}}{{/compare}}')();
        }).to.throw('handlebars Helper {{compare}} expects 4 arguments');
        expect(function() {
          hbs.compile('{{#compare a b}}{{/compare}}')();
        }).to.throw('handlebars Helper {{compare}} expects 4 arguments');
        done();
      });

      it('should throw an error when the operator is invalid', function(done) {
        expect(function() {
          hbs.compile('{{#compare a "~" b}}{{/compare}}')();
        }).to.throw('helper {{compare}}: invalid operator: `~`');
        done();
      });
    });

    describe('operators', function() {
      describe('==', function() {
        var fn = hbs.compile('{{#compare a "==" b}}A{{else}}B{{/compare}}');

        it('should render the first block if `a` equals `b`', function(done) {
          expect(fn({a: '0', b: 0})).to.equal('A');
          done();
        });
        it('should render the second block if false', function(done) {
          expect(fn({a: 'foo', b: 0})).to.equal('B');
          done();
        });
      });

      describe('===', function() {
        var fn = hbs.compile('{{#compare a "===" b}}A{{else}}B{{/compare}}');

        it('should render the first block if `a` strictly equals `b`', function(done) {
          expect(fn({a: '1', b: '1'})).to.equal('A');
          done();
        });
        it('should render the second block if false', function(done) {
          expect(fn({a: '1', b: 1})).to.equal('B');
          done();
        });
      });

      describe('!=', function() {
        var fn = hbs.compile('{{#compare a "!=" b}}A{{else}}B{{/compare}}');

        it('should render the first block if `a` does not equal `b`', function(done) {
          expect(fn({a: 10, b: '11'})).to.equal('A');
          done();
        });
        it('should render the second block if false', function(done) {
          expect(fn({a: 10, b: '10'})).to.equal('B');
          done();
        });
      });

      describe('!==', function() {
        var fn = hbs.compile('{{#compare a "!==" b}}A{{else}}B{{/compare}}');

        it('should render the first block if `a` does not strictly equal `b`', function(done) {
          expect(fn({a: 10, b: 11})).to.equal('A');
          done();
        });
        it('should render the second block if false', function(done) {
          expect(fn({a: 10, b: 10})).to.equal('B');
          done();
        });
      });

      describe('>', function() {
        var fn = hbs.compile('{{#compare a ">" b}}greater than or equal to 15{{else}}less than 15{{/compare}}');

        it('should render the first block if true.', function(done) {
          expect(fn({a: 20, b: 15})).to.equal('greater than or equal to 15');
          done();
        });

        it('should render the second block if false.', function(done) {
          expect(fn({a: 14, b: 15})).to.equal('less than 15');
          done();
        });
      });

      describe('<', function() {
        var fn = hbs.compile('I knew it, {{#compare unicorns "<" ponies}}unicorns are just low-quality ponies!{{else}}unicorns are special!{{/compare}}');

        it('should render the first block if true.', function(done) {
          var res = fn({unicorns: 5, ponies: 6});
          expect(res).to.equal('I knew it, unicorns are just low-quality ponies!');
          done();
        });

        it('should render the second block if false.', function(done) {
          var res = fn({unicorns: 7, ponies: 6});
          expect(res).to.equal('I knew it, unicorns are special!');
          done();
        });
      });

      describe('>=', function() {
        var fn = hbs.compile('{{#compare a ">=" b}}greater than or equal to 15{{else}}less than 15{{/compare}}');

        it('should render the first block if true.', function(done) {
          expect(fn({a: 20, b: 15})).to.equal('greater than or equal to 15');
          done();
        });

        it('should render the first block if equal.', function(done) {
          expect(fn({a: 15, b: 15})).to.equal('greater than or equal to 15');
          done();
        });

        it('should render the second block if false.', function(done) {
          expect(fn({a: 14, b: 15})).to.equal('less than 15');
          done();
        });
      });

      describe('<=', function() {
        var fn = hbs.compile('{{#compare a "<=" b}}less than or equal to 10{{else}}greater than 10{{/compare}}');

        it('should render the first block if true.', function(done) {
          expect(fn({a: 10, b: 15})).to.equal('less than or equal to 10');
          done();
        });

        it('should render the second block if false.', function(done) {
          expect(fn({a: 20, b: 15})).to.equal('greater than 10');
          done();
        });
      });

      describe('typeof', function() {
        it('should render the first block if true', function(done) {
          var fn = hbs.compile('{{#compare obj "typeof" "object"}}A{{else}}B{{/compare}}');
          expect(fn({obj: {}})).to.equal('A');
          done();
        });
      });
    });
  });

  describe('contains', function() {
    it('should render a block if the condition is true.', function(done) {
      var fn = hbs.compile('{{#contains context "C"}}A{{else}}B{{/contains}}');
      expect(fn({context: 'CCC'})).to.equal('A');
      done();
    });

    it('should render the inverse block if false.', function(done) {
      var fn = hbs.compile('{{#contains context "zzz"}}A{{else}}B{{/contains}}');
      expect(fn({context: 'CCC'})).to.equal('B');
      done();
    });

    it('should work with arrays', function(done) {
      var fn = hbs.compile('{{#contains array "a"}}A{{else}}B{{/contains}}');
      expect(fn({array: ['a', 'b', 'c']})).to.equal('A');
      done();
    });

    it('should render the block when an index is passed::', function(done) {
      var fn = hbs.compile('{{#contains array "a" 0}}A{{else}}B{{/contains}}');
      expect(fn({array: ['a', 'b', 'c']})).to.equal('A');
      done();
    });

    it('should render the inverse block when false with index:', function(done) {
      var fn = hbs.compile('{{#contains array "a" 1}}A{{else}}B{{/contains}}');
      expect(fn({array: ['a', 'b', 'c']})).to.equal('B');
      done();
    });
  });

  describe('gt', function() {
    var fn = hbs.compile('{{#gt a b}}A{{else}}B{{/gt}}');

    describe('second arg', function() {
      it('should render the first block if true.', function(done) {
        expect(fn({a: 20, b: 15})).to.equal('A');
        done();
      });
      it('should render the second block if equal.', function(done) {
        expect(fn({a: 15, b: 15})).to.equal('B');
        done();
      });
      it('should render the second block if false.', function(done) {
        expect(fn({a: 14, b: 15})).to.equal('B');
        done();
      });
    });

    describe('compare hash', function() {
      it('should not render a block if the value is not equal to a given number.', function(done) {
        var fn = hbs.compile('{{#gt number compare=8}}A{{/gt}}');
        expect(fn({number: 5})).to.equal('');
        done();
      });
      it('should render a block if the value is greater than a given number.', function(done) {
        var fn = hbs.compile('{{#gt number compare=8}}A{{/gt}}');
        expect(fn({number: 10})).to.equal('A');
        done();
      });
      it('should not render a block if the value is less than a given number.', function(done) {
        var fn = hbs.compile('{{#gt number compare=8}}A{{/gt}}');
        expect(fn({number: 5})).to.equal('');
        done();
      });
    });
  });

  describe('gte', function() {
    describe('second argument', function() {
      var fn = hbs.compile('{{#gte a b}}A{{else}}B{{/gte}}');

      it('should render the first block if true.', function(done) {
        expect(fn({a: 20, b: 15})).to.equal('A');
        done();
      });
      it('should render the first block if equal.', function(done) {
        expect(fn({a: 15, b: 15})).to.equal('A');
        done();
      });
      it('should render the second block if false.', function(done) {
        expect(fn({a: 14, b: 15})).to.equal('B');
        done();
      });
    });

    describe('hash compare', function() {
      it('should render a block if the value is greater than a given number.', function(done) {
        var fn = hbs.compile('{{#gte number compare=8}}A{{/gte}}');
        expect(fn({number: 12})).to.equal('A');
        done();
      });
      it('should render a block if the value is equal to a given number.', function(done) {
        var fn = hbs.compile('{{#gte number compare=8}}A{{/gte}}');
        expect(fn({number: 8})).to.equal('A');
        done();
      });
      it('should not render a block if the value is less than a given number.', function(done) {
        var fn = hbs.compile('{{#gte number compare=8}}A{{/gte}}');
        expect(fn({number: 5})).to.equal('');
        done();
      });
    });
  });

  describe('has', function() {
    it('should render a block if the condition is true.', function(done) {
      var fn = hbs.compile('{{#has context "C"}}A{{else}}B{{/has}}');
      expect(fn({context: 'CCC'})).to.equal('A');
      done();
    });

    it('should render the inverse block if false.', function(done) {
      var fn = hbs.compile('{{#has context "zzz"}}A{{else}}B{{/has}}');
      expect(fn({context: 'CCC'})).to.equal('B');
      done();
    });

    it('should render the inverse block if value is undefined.', function(done) {
      var fn = hbs.compile('{{#has context}}A{{else}}B{{/has}}');
      expect(fn({context: 'CCC'})).to.equal('B');
      done();
    });

    it('should render the inverse block if context is undefined.', function(done) {
      var fn = hbs.compile('{{#has}}A{{else}}B{{/has}}');
      expect(fn({context: 'CCC'})).to.equal('B');
      done();
    });

    it('should work with arrays', function(done) {
      var fn = hbs.compile('{{#has array "a"}}A{{else}}B{{/has}}');
      expect(fn({array: ['a', 'b', 'c']})).to.equal('A');
      done();
    });

    it('should work with two strings', function(done) {
      var fn = hbs.compile('{{#has "abc" "a"}}A{{else}}B{{/has}}');
      expect(fn()).to.equal('A');
      done();
    });

    it('should return the inverse when the second string is not found', function(done) {
      var fn = hbs.compile('{{#has "abc" "z"}}A{{else}}B{{/has}}');
      expect(fn()).to.equal('B');
      done();
    });

    it('should work with object keys', function(done) {
      var fn = hbs.compile('{{#has object "a"}}A{{else}}B{{/has}}');
      expect(fn({object: {a: 'b'}})).to.equal('A');
      done();
    });
  });

  describe('eq', function() {
    it('should render a block if the value is equal to a given number.', function(done) {
      var fn = hbs.compile('{{#eq number compare=8}}A{{/eq}}');
      expect(fn({number: 8})).to.equal('A');
      done();
    });

    it('should render the inverse block if falsey.', function(done) {
      var fn = hbs.compile('{{#eq number compare=8}}A{{else}}B{{/eq}}');
      expect(fn({number: 9})).to.equal('B');
      done();
    });

    it('should compare first and second args', function(done) {
      var fn = hbs.compile('{{#eq number 8}}A{{else}}B{{/eq}}');
      expect(fn({number: 9})).to.equal('B');
      done();
    });
  });

  describe('ifEven', function() {
    it('should render the block if the given value is an even number', function(done) {
      var fn = hbs.compile('{{#ifEven number}}A{{else}}B{{/ifEven}}');
      expect(fn({number: 8})).to.equal('A');
      done();
    });

    it('should render the inverse block if the number is odd', function(done) {
      var fn = hbs.compile('{{#ifEven number}}A{{else}}B{{/ifEven}}');
      expect(fn({number: 9})).to.equal('B');
      done();
    });
  });

  describe('ifNth', function() {
    it('should render a custom class on even rows', function(done) {
      var source = '{{#each items}}<div{{#ifNth 2 @index}}{{else}} class="row-alternate"{{/ifNth}}>{{name}}</div>{{/each}}';
      var fn = hbs.compile(source);
      var context = {
        items: [
          { name: 'Philip J. Fry' },
          { name: 'Turanga Leela' },
          { name: 'Bender Bending Rodriguez' },
          { name: 'Amy Wong' },
          { name: 'Hermes Conrad' }
        ]
      };
      expect(fn(context), [
        '<div>Philip J. Fry</div>',
        '<div class="row-alternate">Turanga Leela</div>',
        '<div>Bender Bending Rodriguez</div>',
        '<div class="row-alternate">Amy Wong</div>',
        '<div>Hermes Conrad</div>'
      ].join(''));
      done();
    });
  });

  describe('ifOdd', function() {
    it('should render the block if the given value is an even number', function(done) {
      var fn = hbs.compile('{{#ifOdd number}}A{{else}}B{{/ifOdd}}');
      expect(fn({number: 9})).to.equal('A');
      done();
    });

    it('should render the inverse block if the number is odd', function(done) {
      var fn = hbs.compile('{{#ifOdd number}}A{{else}}B{{/ifOdd}}');
      expect(fn({number: 8})).to.equal('B')
      done();
    });
  });

  describe('is', function() {
    it('should render a block if the condition is true.', function(done) {
      var fn = hbs.compile('{{#is value "CCC"}}A{{else}}B{{/is}}');
      expect(fn({value: 'CCC'})).to.equal('A');
      done();
    });

    it('should use the `compare` arg on the options hash', function(done) {
      var fn = hbs.compile('{{#is value compare="CCC"}}A{{else}}B{{/is}}');
      expect(fn({value: 'CCC'})).to.equal('A');
      done();
    });

    it('should render the inverse if the condition is false', function(done) {
      var fn = hbs.compile('{{#is value "FOO"}}A{{else}}B{{/is}}');
      expect(fn({value: 'CCC'})).to.equal('B');
      done();
    });
  });

  describe('isnt', function() {
    it('should render a block if the condition is not true.', function(done) {
      var fn = hbs.compile('{{#isnt number 2}}A{{else}}B{{/isnt}}');
      expect(fn({number: 3})).to.equal('A');
      done();
    });

    it('should use the `compare` arg on the options hash', function(done) {
      var fn = hbs.compile('{{#isnt value compare="CCC"}}A{{else}}B{{/isnt}}');
      expect(fn({value: 'CCC'})).to.equal('B');
      done();
    });

    it('should render the inverse if the condition is false', function(done) {
      var fn = hbs.compile('{{#isnt value "FOO"}}A{{else}}B{{/isnt}}');
      expect(fn({value: 'CCC'})).to.equal('A');
      done();
    });
  });

  describe('lt', function() {
    describe('second arg', function() {
      var fn = hbs.compile('{{#lt a b}}A{{else}}B{{/lt}}');

      it('should render the first block if true.', function(done) {
        expect(fn({a: 14, b: 15})).to.equal('A');
        done();
      });
      it('should render the second block if equal.', function(done) {
        expect(fn({a: 15, b: 15})).to.equal('B');
        done();
      });
      it('should render the second block if false.', function(done) {
        expect(fn({a: 20, b: 15})).to.equal('B');
        done();
      });
    });

    describe('compare hash', function() {
      it('should render a block if the value is less than a given number.', function(done) {
        var fn = hbs.compile('{{#lt number compare=8}}A{{/lt}}');
        expect(fn({number: 5})).to.equal('A');
        done();
      });
      it('should not render a block if the value is greater than a given number.', function(done) {
        var fn = hbs.compile('{{#lt number compare=8}}A{{/lt}}');
        expect(fn({number: 42})).to.equal('');
        done();
      });
    });
  });

  describe('lte', function() {
    var fn = hbs.compile('{{#lte a b}}A{{else}}B{{/lte}}');

    describe('second arg', function() {
      it('should render the first block if true.', function(done) {
        expect(fn({a: 14, b: 15})).to.equal('A');
        done();
      });

      it('should render the first block if equal.', function(done) {
        expect(fn({a: 15, b: 15})).to.equal('A');
        done();
      });

      it('should render the second block if false.', function(done) {
        expect(fn({a: 20, b: 15})).to.equal('B');
        done();
      });
    });

    describe('compare hash', function() {
      it('should render a block if the value is less than a given number.', function(done) {
        var fn = hbs.compile('{{#lte number compare=8}}A{{/lte}}');
        expect(fn({number: 1})).to.equal('A');
        done();
      });

      it('should render a block if the value is equal to a given number.', function(done) {
        var fn = hbs.compile('{{#lte number compare=8}}A{{/lte}}');
        expect(fn({number: 8})).to.equal('A');
        done();
      });

      it('should not render a block if the value is greater than a given number.', function(done) {
        var fn = hbs.compile('{{#lte number compare=8}}A{{/lte}}');
        expect(fn({number: 27})).to.equal('');
        done();
      });
    });
  });

  describe('neither', function() {
    it('should render a block if one of the values is truthy.', function(done) {
      var fn = hbs.compile('{{#neither great magnificent}}A{{else}}B{{/neither}}');
      expect(fn({great: false, magnificent: false})).to.equal('A');
      done();
    });

    it('should render the inverse block if neither are true.', function(done) {
      var fn = hbs.compile('{{#neither great magnificent}}A{{else}}B{{/neither}}');
      expect(fn({great: true, magnificent: false})).to.equal('B');
      done();
    });
  });

  describe('or', function() {
    it('should render a block if one of the values is truthy.', function(done) {
      var fn = hbs.compile('{{#or great magnificent}}A{{else}}B{{/or}}');
      expect(fn({great: false, magnificent: true})).to.equal('A');
      done();
    });
    it('should render a block if any of the values are truthy.', function(done) {
      var fn = hbs.compile('{{#or great magnificent fantastic}}A{{else}}B{{/or}}');
      expect(fn({great: false, magnificent: false, fantastic: true})).to.equal('A');
      done();
    });
    it('should render the inverse block if neither are true.', function(done) {
      var fn = hbs.compile('{{#or great magnificent}}A{{else}}B{{/or}}');
      expect(fn({great: false, magnificent: false})).to.equal('B');
      done();
    });
    it('should render the inverse block if none are true.', function(done) {
      var fn = hbs.compile('{{#or great magnificent fantastic}}A{{else}}B{{/or}}');
      expect(fn({great: false, magnificent: false, fantastic: false})).to.equal('B');
      done();
    });
  });

  describe('unlessEq', function() {
    it('should render a block unless the value is equal to a given number.', function(done) {
      var fn = hbs.compile('{{#unlessEq number compare=8}}A{{/unlessEq}}');
      expect(fn({number: 10})).to.equal('A');
      done();
    });
    it('should render a block unless the value is equal to a given number.', function(done) {
      var fn = hbs.compile('{{#unlessEq number compare=8}}A{{/unlessEq}}');
      expect(fn({number: 8})).to.equal('');
      done();
    });
  });

  describe('unlessGt', function() {
    it('should render a block unless the value is greater than a given number.', function(done) {
      var fn = hbs.compile('{{#unlessGt number compare=8}}A{{/unlessGt}}');
      expect(fn({number: 5})).to.equal('A');
      done();
    });
    it('should render a block unless the value is greater than a given number.', function(done) {
      var fn = hbs.compile('{{#unlessGt number compare=8}}A{{/unlessGt}}');
      expect(fn({number: 10})).to.equal('');
      done();
    });
  });

  describe('unlessLt', function() {
    it('should render a block unless the value is less than a given number.', function(done) {
      var fn = hbs.compile('{{#unlessLt number compare=8}}A{{/unlessLt}}');
      expect(fn({number: 10})).to.equal('A');
      done();
    });
    it('should render a block unless the value is less than a given number.', function(done) {
      var fn = hbs.compile('{{#unlessLt number compare=8}}A{{/unlessLt}}');
      expect(fn({number: 5})).to.equal('');
      done();
    });
  });

  describe('unlessGteq', function() {
    it('should render a block unless the value is greater than or equal to a given number.', function(done) {
      var fn = hbs.compile('{{#unlessGteq number compare=8}}A{{/unlessGteq}}');
      expect(fn({number: 4})).to.equal('A');
      done();
    });
    it('should render a block unless the value is greater than or equal to a given number.', function(done) {
      var fn = hbs.compile('{{#unlessGteq number compare=8}}A{{/unlessGteq}}');
      expect(fn({number: 8})).to.equal('');
      done();
    });
    it('should not render a block unless the value is greater than or equal to a given number.', function(done) {
      var fn = hbs.compile('{{#unlessGteq number compare=8}}A{{/unlessGteq}}');
      expect(fn({number: 34})).to.equal('');
      done();
    });
  });

  describe('unlessLteq', function() {
    it('should render a block unless the value is less than or equal to a given number.', function(done) {
      var fn = hbs.compile('{{#unlessLteq number compare=8}}A{{/unlessLteq}}');
      expect(fn({number: 10})).to.equal('A');
      done();
    });
    it('should render a block unless the value is less than or equal to a given number.', function(done) {
      var fn = hbs.compile('{{#unlessLteq number compare=8}}A{{/unlessLteq}}');
      expect(fn({number: 8})).to.equal('');
      done();
    });
    it('should not render a block unless the value is less than or equal to a given number.', function(done) {
      var fn = hbs.compile('{{#unlessLteq number compare=8}}A{{/unlessLteq}}');
      expect(fn({number: 4})).to.equal('');
      done();
    });
  });
});