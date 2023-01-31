const Code = require("code");
const Lab = require("lab");
const lab = (exports.lab = Lab.script());
const expect = Code.expect;
const it = lab.it;
const describe = lab.describe;

var markdown = require("../../../../../helpers/3p/utils/lib/markdown");

const { buildRenderer } = require("../../../../spec-helpers");
const renderer = buildRenderer();
const hbs = renderer.handlebars;

var hljs = require("highlight.js");

function highlight(code, language) {
  console.log(code, language);
  try {
    try {
      return hljs.highlight(code, { language }).value;
    } catch (err) {
      if (!/Unknown language/i.test(err.message)) {
        throw err;
      }
      return hljs.highlightAuto(code).value;
    }
  } catch (err) {
    return code;
  }
}

describe("sync", function () {
  describe("markdown helper", function () {
    it("should render markdown:", function (done) {
      expect(markdown("# heading")).to.equal("<h1>heading</h1>\n");
      done();
    });

    it("should highlight code blocks", function (done) {
      var html = markdown('```js\nvar foo = "bar";\n```\n', {
        highlight: highlight,
      });
      expect(html).to.equal(
        '<pre><code class="language-js"><span class="hljs-keyword">var</span> foo = <span class="hljs-string">&quot;bar&quot;</span>;\n</code></pre>\n'
      );
      done();
    });

    // it("should pass options to remarkable", function (done) {
    //   var a = markdown("abc https://github.com/jonschlinkert/remarkable xyz", {
    //     highlight: highlight,
    //     linkify: true,
    //   });
    //   expect(a).to.equal(
    //     '<p>abc <a href="https://github.com/jonschlinkert/remarkable">https://github.com/jonschlinkert/remarkable</a> xyz</p>\n'
    //   );

    //   var b = markdown("abc https://github.com/jonschlinkert/remarkable xyz", {
    //     highlight: highlight,
    //     linkify: false,
    //   });
    //   expect(b).to.equal(
    //     "<p>abc https://github.com/jonschlinkert/remarkable xyz</p>\n"
    //   );
    //   done();
    // });

    it("should pass options to highlight.js:", function (done) {
      var html = markdown('```js\nvar foo = "bar";\n```\n', {
        highlight: highlight,
        langPrefix: "language-",
      });
      expect(html).to.equal(
        '<pre><code class="language-js"><span class="hljs-keyword">var</span> foo = <span class="hljs-string">&quot;bar&quot;</span>;\n</code></pre>\n'
      );
      done();
    });
  });

  describe("handlebars:", function () {
    it("should work as a handlebars helper:", function (done) {
      hbs.registerHelper("markdown", markdown({ highlight: highlight }));
      expect(
        hbs.compile("{{#markdown}}# {{title}}{{/markdown}}")({
          title: "heading",
        })
      ).to.equal("<h1>heading</h1>\n");
      done();
    });

    // it("should pass hash options to remarkable:", function (done) {
    //   hbs.registerHelper("markdown", markdown({ highlight: highlight }));

    //   // `linkify: true`
    //   var a = hbs.compile(
    //     "{{#markdown linkify=true}}abc https://github.com/jonschlinkert/remarkable xyz{{/markdown}}"
    //   )();
    //   expect(a).to.equal(
    //     '<p>abc <a href="https://github.com/jonschlinkert/remarkable">https://github.com/jonschlinkert/remarkable</a> xyz</p>\n'
    //   );

    //   // `linkify: false`
    //   var b = hbs.compile(
    //     "{{#markdown linkify=false}}abc https://github.com/jonschlinkert/remarkable xyz{{/markdown}}"
    //   )();
    //   expect(b).to.equal(
    //     "<p>abc https://github.com/jonschlinkert/remarkable xyz</p>\n"
    //   );
    //   done();
    // });

    it("should pass hash options to highlight.js:", function (done) {
      hbs.registerHelper("markdown", markdown({ highlight: highlight }));

      // `langPrefix = language-`
      var a = hbs.compile(
        '{{#markdown}}```js\nvar foo = "bar";\n```\n{{/markdown}}'
      )();
      expect(a).to.equal(
        '<pre><code class="language-js"><span class="hljs-keyword">var</span> foo = <span class="hljs-string">&quot;bar&quot;</span>;\n</code></pre>\n'
      );

      // `langPrefix = language-`
      var b = hbs.compile(
        '{{#markdown langPrefix="language-"}}```js\nvar foo = "bar";\n```\n{{/markdown}}'
      )();
      expect(b).to.equal(
        '<pre><code class="language-js"><span class="hljs-keyword">var</span> foo = <span class="hljs-string">&quot;bar&quot;</span>;\n</code></pre>\n'
      );
      done();
    });
  });
});
