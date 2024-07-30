'use strict';


const factory = () => {
    /**
     * @deprecate
     */
    return function(...args) {
        args.pop();
        const target = args.shift();
        const toReturn = {};
        const paths = args[0];
        if (paths && Array.isArray(paths)) {
            paths.forEach((key) => {
                if (target.hasOwnProperty(key)) {
                    toReturn[key] = target[key];
                }
            })
        }

        return toReturn;
    };
};

module.exports = [{
    name: 'pick',
    factory: factory,
}];
