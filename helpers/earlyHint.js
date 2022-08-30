'use strict';

const {addResourceHint} = require('./lib/resourceHints');

const factory = globals => {
    return function (path, state) {
        const options = arguments[arguments.length - 1];

        const cors = options.hash.cors;

        addResourceHint(
            globals,
            path,
            state,
            undefined,
            cors
        );

        return path;
    }
};

module.exports = [{
    name: 'earlyHint',
    factory
}];
