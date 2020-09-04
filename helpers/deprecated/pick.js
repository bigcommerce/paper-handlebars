'use strict';

const factory = () => {
    /**
     * @deprecate
     */
    return function(obj, ...args) {
        return args.reduce(
            (
                pickedElements,
                element
            ) => {
                if (obj && obj.hasOwnProperty(element)) {
                    pickedElements[element] = obj[element];
                }

                return pickedElements;
            },
            {}
        );
    };
};

module.exports = [{
    name: 'pick',
    factory: factory,
}];
