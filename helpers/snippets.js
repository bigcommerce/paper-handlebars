'use strict';

const factory = globals => {
    return function(location) {
        return '<!-- snippet location ' + location + ' -->';
    };
};

module.exports = [{
    name: 'snippet',
    factory: factory,
}];
