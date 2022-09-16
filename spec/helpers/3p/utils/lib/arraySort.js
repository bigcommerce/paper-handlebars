const Code = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const expect = Code.expect;
const it = lab.it;
const describe = lab.describe;

const arraySort = require('../../../../../helpers/3p/utils/lib/arraySort');
const {getValue: get } = require('../../../../../helpers/lib/common');

describe('errors', function() {
  it('should throw an error when invalid args are passed:', function(done) {
    expect(function() {
      arraySort({});
    }).to.throw('array-sort expects an array.');
    done();
  });
});

describe('empty array', function() {
  it('should return an empty array when null or undefined is passed', function(done) {
    expect(arraySort()).to.equal([]);
    expect(arraySort(undefined)).to.equal([]);
    expect(arraySort(null)).to.equal([]);
    done();
  })
});

describe('basic sort', function() {
  it('should sort an array of primitives', function(done) {
    var arr = ['d', 3, 'b', 'a', 'd', 1, 0, 'z'];
    expect(arraySort(arr)).to.equal([ 0, 1, 3, 'a', 'b', 'd', 'd', 'z' ]);
    done();
  })
});

describe('arraySort', function() {
  var posts = [
    { path: 'a.md', locals: { date: '2014-01-09' } },
    { path: 'f.md', locals: { date: '2014-01-02' } },
    { path: 'd.md', locals: { date: '2013-05-06' } },
    { path: 'e.md', locals: { date: '2015-01-02' } },
    { path: 'b.md', locals: { date: '2012-01-02' } },
    { path: 'f.md', locals: { date: '2014-06-01' } },
    { path: 'c.md', locals: { date: '2015-04-12' } },
    { path: 'g.md', locals: { date: '2014-02-02' } },
  ];

  it('should sort by a property:', function(done) {
    var arr = [{key: 'y'}, {key: 'z'}, {key: 'x'}];
    expect(arraySort(arr, 'key')).to.equal([
      {key: 'x'},
      {key: 'y'},
      {key: 'z'}
    ]);

    expect(arraySort(posts, 'path')).to.equal([
      { path: 'a.md', locals: { date: '2014-01-09' } },
      { path: 'b.md', locals: { date: '2012-01-02' } },
      { path: 'c.md', locals: { date: '2015-04-12' } },
      { path: 'd.md', locals: { date: '2013-05-06' } },
      { path: 'e.md', locals: { date: '2015-01-02' } },
      { path: 'f.md', locals: { date: '2014-01-02' } },
      { path: 'f.md', locals: { date: '2014-06-01' } },
      { path: 'g.md', locals: { date: '2014-02-02' } }
    ]);
    done();
  });

  it('should sort by a nested property:', function(done) {
    var res = expect(arraySort(posts, 'locals.date'));
    res.to.equal([
      { path: 'b.md', locals: { date: '2012-01-02' } },
      { path: 'd.md', locals: { date: '2013-05-06' } },
      { path: 'f.md', locals: { date: '2014-01-02' } },
      { path: 'a.md', locals: { date: '2014-01-09' } },
      { path: 'g.md', locals: { date: '2014-02-02' } },
      { path: 'f.md', locals: { date: '2014-06-01' } },
      { path: 'e.md', locals: { date: '2015-01-02' } },
      { path: 'c.md', locals: { date: '2015-04-12' } }
    ]);
    done();
  });

  it('should do nothing when the specified property is not a string:', function(done) {
    var arr = [
      {a: {b: {c: 'c'}}},
      {a: {b: {z: 'z'}}},
      {a: {b: {u: 'u'}}},
      {a: {b: {y: 'y'}}}
    ];

    expect(arraySort(arr, 'a.b')).to.equal([
      {a: {b: {c: 'c'}}},
      {a: {b: {z: 'z'}}},
      {a: {b: {u: 'u'}}},
      {a: {b: {y: 'y'}}}
    ]);
    done();
  });

  it('should sort by multiple properties:', function(done) {
    var posts = [
      { foo: 'bbb', locals: { date: '2013-05-06' } },
      { foo: 'aaa', locals: { date: '2012-01-02' } },
      { foo: 'ddd', locals: { date: '2015-04-12' } },
      { foo: 'ccc', locals: { date: '2014-01-02' } },
      { foo: 'ccc', locals: { date: '2015-01-02' } },
      { foo: 'ddd', locals: { date: '2014-01-09' } },
      { foo: 'bbb', locals: { date: '2014-06-01' } },
      { foo: 'aaa', locals: { date: '2014-02-02' } },
    ];

    var actual = arraySort(posts, ['foo', 'locals.date']);

    expect(actual).to.equal([
      { foo: 'aaa', locals: { date: '2012-01-02' } },
      { foo: 'aaa', locals: { date: '2014-02-02' } },
      { foo: 'bbb', locals: { date: '2013-05-06' } },
      { foo: 'bbb', locals: { date: '2014-06-01' } },
      { foo: 'ccc', locals: { date: '2014-01-02' } },
      { foo: 'ccc', locals: { date: '2015-01-02' } },
      { foo: 'ddd', locals: { date: '2014-01-09' } },
      { foo: 'ddd', locals: { date: '2015-04-12' } }
    ]);
    done();
  });

  // TODO: Not working!

  // it('should sort with a function:', function(done) {
  //   var arr = [{key: 'y'}, {key: 'z'}, {key: 'x'}];

  //   var actual = arraySort(arr, function(a, b) {
  //     return a.key > b.key;
  //   });

  //   expect(actual).to.equal([
  //     {key: 'x'},
  //     {key: 'y'},
  //     {key: 'z'}
  //   ]);
  //   done();
  // });

  it('should support sorting with a list of function:', function(done) {
    var arr = [
      {foo: 'w', bar: 'y', baz: 'w', quux: 'a'},
      {foo: 'x', bar: 'y', baz: 'w', quux: 'b'},
      {foo: 'x', bar: 'y', baz: 'z', quux: 'c'},
      {foo: 'x', bar: 'x', baz: 'w', quux: 'd'},
    ];

    var compare = function(prop) {
      return function(a, b) {
        return a[prop].localeCompare(b[prop]);
      };
    };

    var actual = arraySort(arr,
      compare('foo'),
      compare('bar'),
      compare('baz'),
      compare('quux'));

    expect(actual).to.equal([
      { foo: 'w', bar: 'y', baz: 'w', quux: 'a' },
      { foo: 'x', bar: 'x', baz: 'w', quux: 'd' },
      { foo: 'x', bar: 'y', baz: 'w', quux: 'b' },
      { foo: 'x', bar: 'y', baz: 'z', quux: 'c' }
    ]);
    done();
  });

  it('should support sorting with an array of function:', function(done) {
    var arr = [
      {foo: 'w', bar: 'y', baz: 'w', quux: 'a'},
      {foo: 'x', bar: 'y', baz: 'w', quux: 'b'},
      {foo: 'x', bar: 'y', baz: 'z', quux: 'c'},
      {foo: 'x', bar: 'x', baz: 'w', quux: 'd'},
    ];

    var compare = function(prop) {
      return function(a, b) {
        return a[prop].localeCompare(b[prop]);
      };
    };

    var actual = arraySort(arr, [
      compare('foo'),
      compare('bar'),
      compare('baz'),
      compare('quux')
    ]);

    expect(actual).to.equal([
      { foo: 'w', bar: 'y', baz: 'w', quux: 'a' },
      { foo: 'x', bar: 'x', baz: 'w', quux: 'd' },
      { foo: 'x', bar: 'y', baz: 'w', quux: 'b' },
      { foo: 'x', bar: 'y', baz: 'z', quux: 'c' }
    ]);
    done();
  });

  it('should support sorting with any combination of functions and properties:', function(done) {
    var posts = [
      { path: 'a.md', locals: { date: '2014-01-01', foo: 'zzz', bar: 1 } },
      { path: 'f.md', locals: { date: '2014-01-01', foo: 'mmm', bar: 2 } },
      { path: 'd.md', locals: { date: '2014-01-01', foo: 'xxx', bar: 3 } },
      { path: 'i.md', locals: { date: '2014-01-01', foo: 'xxx', bar: 5 } },
      { path: 'k.md', locals: { date: '2014-01-01', foo: 'xxx', bar: 1 } },
      { path: 'j.md', locals: { date: '2014-01-01', foo: 'xxx', bar: 4 } },
      { path: 'h.md', locals: { date: '2014-01-01', foo: 'xxx', bar: 6 } },
      { path: 'l.md', locals: { date: '2014-01-01', foo: 'xxx', bar: 7 } },
      { path: 'e.md', locals: { date: '2015-01-02', foo: 'aaa', bar: 8 } },
      { path: 'b.md', locals: { date: '2012-01-02', foo: 'ccc', bar: 9 } },
      { path: 'f.md', locals: { date: '2014-06-01', foo: 'rrr', bar: 10 } },
      { path: 'c.md', locals: { date: '2015-04-12', foo: 'ttt', bar: 11 } },
      { path: 'g.md', locals: { date: '2014-02-02', foo: 'yyy', bar: 12 } },
    ];

    var compare = function(prop) {
      return function(a, b, fn) {
        var valA = get(a, prop);
        var valB = get(b, prop);
        return fn(valA, valB);
      };
    };

    var actual = arraySort(posts, 'locals.date', 'doesnt.exist', compare('locals.foo'), [
      compare('locals.bar')
    ]);

    expect(actual).to.equal([
      { path: 'b.md', locals: { date: '2012-01-02', foo: 'ccc', bar: 9 } },
      { path: 'f.md', locals: { date: '2014-01-01', foo: 'mmm', bar: 2 } },
      { path: 'k.md', locals: { date: '2014-01-01', foo: 'xxx', bar: 1 } },
      { path: 'd.md', locals: { date: '2014-01-01', foo: 'xxx', bar: 3 } },
      { path: 'j.md', locals: { date: '2014-01-01', foo: 'xxx', bar: 4 } },
      { path: 'i.md', locals: { date: '2014-01-01', foo: 'xxx', bar: 5 } },
      { path: 'h.md', locals: { date: '2014-01-01', foo: 'xxx', bar: 6 } },
      { path: 'l.md', locals: { date: '2014-01-01', foo: 'xxx', bar: 7 } },
      { path: 'a.md', locals: { date: '2014-01-01', foo: 'zzz', bar: 1 } },
      { path: 'g.md', locals: { date: '2014-02-02', foo: 'yyy', bar: 12 } },
      { path: 'f.md', locals: { date: '2014-06-01', foo: 'rrr', bar: 10 } },
      { path: 'e.md', locals: { date: '2015-01-02', foo: 'aaa', bar: 8 } },
      { path: 'c.md', locals: { date: '2015-04-12', foo: 'ttt', bar: 11 } }
    ]);
    done();
  });

  it('should support reverse sorting with any combination of functions and properties:', function(done) {
    var posts = [
      { path: 'a.md', locals: { date: '2014-01-01', foo: 'zzz', bar: 1 } },
      { path: 'f.md', locals: { date: '2014-01-01', foo: 'mmm', bar: 2 } },
      { path: 'd.md', locals: { date: '2014-01-01', foo: 'xxx', bar: 3 } },
      { path: 'i.md', locals: { date: '2014-01-01', foo: 'xxx', bar: 5 } },
      { path: 'k.md', locals: { date: '2014-01-01', foo: 'xxx', bar: 1 } },
      { path: 'j.md', locals: { date: '2014-01-01', foo: 'xxx', bar: 4 } },
      { path: 'h.md', locals: { date: '2014-01-01', foo: 'xxx', bar: 6 } },
      { path: 'l.md', locals: { date: '2014-01-01', foo: 'xxx', bar: 7 } },
      { path: 'e.md', locals: { date: '2015-01-02', foo: 'aaa', bar: 8 } },
      { path: 'b.md', locals: { date: '2012-01-02', foo: 'ccc', bar: 9 } },
      { path: 'f.md', locals: { date: '2014-06-01', foo: 'rrr', bar: 10 } },
      { path: 'c.md', locals: { date: '2015-04-12', foo: 'ttt', bar: 11 } },
      { path: 'g.md', locals: { date: '2014-02-02', foo: 'yyy', bar: 12 } },
    ];

    var compare = function(prop) {
      return function(a, b, fn) {
        var valA = get(a, prop);
        var valB = get(b, prop);
        return fn(valA, valB);
      };
    };

    var actual = arraySort(posts, 'locals.date', 'doesnt.exist', compare('locals.foo'), [
      compare('locals.bar')
    ], { reverse: true });

    expect(actual).to.equal([
      { path: 'c.md', locals: { date: '2015-04-12', foo: 'ttt', bar: 11 } },
      { path: 'e.md', locals: { date: '2015-01-02', foo: 'aaa', bar: 8 } },
      { path: 'f.md', locals: { date: '2014-06-01', foo: 'rrr', bar: 10 } },
      { path: 'g.md', locals: { date: '2014-02-02', foo: 'yyy', bar: 12 } },
      { path: 'a.md', locals: { date: '2014-01-01', foo: 'zzz', bar: 1 } },
      { path: 'l.md', locals: { date: '2014-01-01', foo: 'xxx', bar: 7 } },
      { path: 'h.md', locals: { date: '2014-01-01', foo: 'xxx', bar: 6 } },
      { path: 'i.md', locals: { date: '2014-01-01', foo: 'xxx', bar: 5 } },
      { path: 'j.md', locals: { date: '2014-01-01', foo: 'xxx', bar: 4 } },
      { path: 'd.md', locals: { date: '2014-01-01', foo: 'xxx', bar: 3 } },
      { path: 'k.md', locals: { date: '2014-01-01', foo: 'xxx', bar: 1 } },
      { path: 'f.md', locals: { date: '2014-01-01', foo: 'mmm', bar: 2 } },
      { path: 'b.md', locals: { date: '2012-01-02', foo: 'ccc', bar: 9 } }
    ]);
    done();
  });
});