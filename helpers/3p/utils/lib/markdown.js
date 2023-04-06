const merge = require('./mixinDeep');
const {Remarkable} = require('remarkable');
const {linkify} = require('remarkable/linkify');

module.exports = function markdown(config) {

    if (typeof config === 'string') {
        return helper.apply(this, arguments);
    }

    config = config || {};
    if (config.fn || config.hash || arguments.length > 1) {
        return helper.apply(this, arguments);
    }

    function helper(context, options) {

        if (typeof context === 'string') {
            const opts = merge({}, config, options);
            const md = buildRemarkable(opts);
            return md.render(context);
        }

        if (typeof context === 'object' && typeof context.fn === 'function') {
            options = context;
            context = {};
        }

        options = merge({html: true, breaks: true}, config, options);
        options = merge({}, options, options.markdown, options.hash);
        if (options.hasOwnProperty('lang')) {
            options.langPrefix = options.lang;
        }

        const md = buildRemarkable(options);
        const ctx = merge({}, options, (this.context || this), context);
        return md.render(options.fn(ctx));
    }

    function buildRemarkable(options) {
        if (options.linkify === true) {
            delete options.linkify;
            return new Remarkable(options).use(linkify);
        }
        return new Remarkable(options);
    }

    return helper;
};
