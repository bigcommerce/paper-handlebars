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

        try {
            return addResourceHint(
                globals,
                href,
                rel,
                as,
                cors
            );
        } catch (e) {
            console.error(`Early hint generation failed for path [${href}]`, e);
            throw e;
        }
    }
};

module.exports = [{
    name: 'earlyHint',
    factory
}];
