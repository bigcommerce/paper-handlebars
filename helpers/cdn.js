'use strict';

const cdnify = require('./lib/cdnify');
const {addResourceHint} = require('./lib/resourceHints');

const factory = globals => {
    const cdn = cdnify(globals);

    return function (path) {
        const fullPath = cdn(path);

        const options = arguments[arguments.length - 1];
        if (options.hash.resourceHint) {
            addResourceHint(
                globals,
                fullPath,
                options.hash.resourceHint
            );
        }

        return fullPath;
    };
};

module.exports = [{
    name: 'cdn',
    factory: factory,
}];
