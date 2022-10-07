'use strict';

const {addResourceHint} = require('./lib/resourceHints');

const factory = globals => {
    return function (path, state) {
        const options = arguments[arguments.length - 1];

        let cors, as = undefined;

        if (options && options.hash) {
            cors = options.hash.cors;
            as = options.hash.as;
        }

        return addResourceHint(
            globals,
            path,
            state,
            as,
            cors
        );
    }
};

module.exports = [{
    name: 'earlyHint',
    factory
}];
