'use strict';
const moment = require('moment');
const utils = require('handlebars-utils');

// Warning that provided value is not in a recognized RFC2822 or ISO format
moment.suppressDeprecationWarnings = true;

const factory = () => {
    return function (str, pattern, options) {
        if (utils.isOptions(pattern)) {
            options = pattern;
            pattern = null;
        }

        // if no args are passed, return a formatted date
        if (str === null && pattern === null) {
            moment.locale('en');
            return moment().format('MMMM DD, YYYY');
        }
      
        const opts = utils.extend({ lang: 'en', date: new Date()}, str, pattern, options);
        
        moment.locale(opts.lang);

        if (typeof str === 'string' && typeof pattern === 'string') {
          return moment(new Date(str)).format(pattern);
        }
      
        if (opts.hash) {
          if (opts.context) {
            opts.hash = utils.extend({}, opts.hash, opts.context);
          }
      
          const res = moment(str);
          for (const key in opts.hash) {
            if (res[key]) {
              return res[key](opts.hash[key]);
            } else {
              console.log('moment.js does not support "' + key + '"');
            }
          }
        }
      
        if (utils.isObject(str)) {
          return moment(str).format(pattern);
        }
      
        // if only a string is passed, assume it's a date pattern ('YYYY')
        if (utils.isString(str) && !pattern) {
          return moment().format(str);
        }
      
        return moment(str).format(pattern);
      };
};

module.exports = [{
    name: 'moment',
    factory: factory,
}];
