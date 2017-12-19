'use strict';

const factory = () => {
    return function(location) {
        return '<!-- snippet location ' + location + ' -->';
    };
};

module.exports = [{
    name: 'snippet',
    factory: factory,
}];
