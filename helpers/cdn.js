'use strict';

const cdnify = require('./lib/cdnify');
const {addResourceHint} = require('./lib/resourceHints');
const utils = require("./3p/utils");


const factory = globals => {
    function addHint(fullPath, options) {
        return addResourceHint(
            globals,
            fullPath,
            options.hash.resourceHint,
            options.hash.as
        );
    }

    const cdn = cdnify(globals);

    return function (path) {
        let fullPath = cdn(path);

        const options = arguments[arguments.length - 1];
        if (options.hash && options.hash.resourceHint) {
            if (!utils.isString(fullPath)) {
                console.warn(`Skipping resource hint creation in CDN fill path was not valid [${fullPath}]`);
                return fullPath;
            }

            const hintPath = addHint(fullPath, options);
            if (utils.isString(hintPath)) {
                return hintPath;
            }

            console.warn(`Resource hint path was invalid [${hintPath}]`);
        }

        return fullPath;
    };
};

module.exports = [{
    name: 'cdn',
    factory: factory,
}];
