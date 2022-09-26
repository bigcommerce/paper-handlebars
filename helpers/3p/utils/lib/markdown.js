const utils = require('handlebars-utils');
const merge = require('./mixinDeep');
const { Remarkable } = require('remarkable');

module.exports = function markdown(config) {

  if (typeof config === 'string') {
    return helper.apply(this, arguments);
  }

  config = config || {};
  if (config.fn || config.hash || arguments.length > 1) {
    console.log(arguments);
    return helper.apply(this, arguments);
  }

  function helper(context, options) {
    if (typeof context === 'string') {
      var opts = merge({}, config, options);
      console.log(options)
      var md = new Remarkable(opts);
      return md.render(context);
    }

    if (utils.isObject(context) && typeof context.fn === 'function') {
      options = context;
      context = {};
    }

    options = merge({ html: true, breaks: true }, config, options);
    options = merge({}, options, options.markdown, options.hash);
    if (options.hasOwnProperty('lang')) {
      options.langPrefix = options.lang;
    }

    var md = new Remarkable(options);
    var ctx = merge({}, options, (this.context || this), context);
    return md.render(options.fn(ctx));
  }

  return helper;
};