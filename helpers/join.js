'use strict';

const factory = () => {
    return function(array, separator) {
        const options = arguments[arguments.length - 1];
        var config = options.hash || {};

        array = array.slice();

        // Truncate array
        if (config.limit && array.length > config.limit) {
            array = array.slice(0, config.limit);
        }

        // Use lastSeparator between last and second last item, if provided
        if (config.lastSeparator) {
            var truncatedArray = array.slice(0, -1),
                lastItem = array.slice(-1);

            return truncatedArray.join(separator) + config.lastSeparator + lastItem;
        }

        return array.join(separator);
    };
};

module.exports = [{
    name: 'join',
    factory: factory,
}];
