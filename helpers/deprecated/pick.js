'use strict';

const factory = () => {
    /**
     * @deprecate
     */
    return function(obj, ...args) {
        const pickedElements = {};

        for (let i = 0; i < args.length; i++) {
            const element = args[i];
            if (obj.hasOwnProperty(element)) {
                pickedElements[element] = obj[element];
            }
        }
        return pickedElements;
    };
};

module.exports = [{
    name: 'pick',
    factory: factory,
}];