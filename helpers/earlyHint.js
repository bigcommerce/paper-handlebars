'use strict';

const {addResourceHint} = require('./lib/resourceHints');

const factory = globals => {
    return function (href, rel) {
        const options = arguments[arguments.length - 1];

        let cors, as = undefined;

        if (options && options.hash) {
            cors = options.hash.crossorigin;
            as = options.hash.as;
        }

        return addResourceHint(
            globals,
            href,
            rel,
            as,
            cors
        );
    }
};

module.exports = [{
    name: 'earlyHint',
    factory
}];
