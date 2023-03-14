'use strict';

/**
 * Concats multi values, primarily used as a subhelper
 * @example
 *  {{multiConcat "string1" "string2" "string3"}}
 */


const factory = globals => {
    return function(...args) {
        // Take the last arg which is a Handlebars options object out of args array
        args.pop();

        return args.join('');
    };

};


module.exports = [{
    name: 'multiConcat',
    factory: factory,
}];
