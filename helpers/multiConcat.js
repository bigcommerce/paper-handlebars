'use strict';
const common = require('./lib/common.js');
const utils = require('handlebars-utils');

/**
 * Concats multi values, primarily used as a subhelper
 * @example
 *  {{multiConcat "string1" "string2" "string3"}}
 */


const factory = globals => {
    return function(...args) {
        // str = common.unwrapIfSafeString(globals.handlebars, str);

        args.forEach(element => {
            const substr = common.unwrapIfSafeString(globals.handlebars, element);
            if (!utils.isString(substr)){
                throw new TypeError("Invalid query parameter string passed to multiConcat");
            }
        });

        // args.forEach(element => {
        //     const substr= new globals.handlebars.SafeString(element);
        //     if (!utils.isString(substr)) {
        //         throw new TypeError("multiConcat parameters must be string");
        //     }
        // });

        // _.every(args, function (arg) {
        //     if (!utils.isString(arg)) {
        //         throw new TypeError("multiConcat parameters must be string");
        //     }
        // });

        return args.join('');
    };

};


module.exports = [{
    name: 'multiConcat',
    factory: factory,
}];
