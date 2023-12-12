'use strict';

/**
 * Get viewport screen size.
 * @example
 *  {{screenSize}}
 */
const factory = () => {
    return function() {
        return window.outerWidth;
    };
};

module.exports = [{
    name: 'screenSize',
    factory: factory,
}];
