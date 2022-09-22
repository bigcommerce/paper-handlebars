'use strict';

const markdown = require('./utils/lib/markdown');
/**
 * Expose markdown `helpers` (for performance we're using getters so
 * that the helpers are only loaded if called)
 */

var helpers = module.exports;

/**
 * Block helper that converts a string of inline markdown to HTML.
 *
 * ```html
 * {{#markdown}}
 * # Foo
 * {{/markdown}}
 * //=> <h1>Foo</h1>
 * ```
 * @name .markdown
 * @param {Object} `context`
 * @param {Object} `options`
 * @return {String}
 * @block
 * @api public
 */

helpers.markdown = function(context, options) {
  return markdown()(context, options);
}
