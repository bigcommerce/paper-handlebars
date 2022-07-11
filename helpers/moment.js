'use strict';

const utils = require('handlebars-utils');
const date = require('date.js');

// suppress error messages that are not actionable
const moment = require('moment');
moment.suppressDeprecationWarnings = true;

/*
 * Modified from https://github.com/helpers/helper-date/blob/1.0.1/index.js
 */
const factory = () => {
    return function (str, pattern) {
        // always use the Handlebars-generated options object
        let options = arguments[arguments.length - 1];

        // Ideally we'd check how many args were passed and set `str` and `pattern` to
        // null if they weren't explicitly provided. However, doing so could break
        // backwards compatibility since we previously depended on helper-date@0.2.3.

        // if no args are passed, return a formatted date
        /* eslint no-eq-null: ["off"] */
        if (str == null && pattern == null) {
            moment.locale('en');
            return moment().format('MMMM DD, YYYY');
        }

        var defaults = { lang: 'en', date: new Date(str) };
        var opts = utils.context(this, defaults, options);

        // set the language to use
        moment.locale(opts.lang || opts.language);

        if (opts.datejs === false) {
            return moment(new Date(str)).format(pattern);
        }

        // if both args are strings, this could apply to either lib.
        // so instead of doing magic we'll just ask the user to tell
        // us if the args should be passed to date.js or moment.
        if (typeof str === 'string' && typeof pattern === 'string') {
            return moment(date(str)).format(pattern);
        }

        // If handlebars, expose moment methods as hash properties
        if (options && options.hash) {
            if (options.context) {
                options.hash = Object.assign({}, options.hash, options.context);
            }

            var res = moment(str);
            for (var key in options.hash) {
                // prevent access to prototype methods
                if (Object.keys(moment.prototype).indexOf(key) !== -1 && typeof res[key] === 'function') {
                    return res[key](options.hash[key]);
                } else {
                    console.error('moment.js does not support "' + key + '"');
                }
            }
        }

        if (utils.isObject(str)) {
            return moment(str).format(pattern);
        }

        // if only a string is passed, assume it's a date pattern ('YYYY')
        if (typeof str === 'string' && !pattern) {
            return moment().format(str);
        }

        return moment(str).format(pattern);
    };
};

module.exports = [{
    name: "moment",
    factory: factory,
}]