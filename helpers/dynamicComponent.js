'use strict';

const Path = require('path');

const factory = globals => {
    return function(path) {
        if (!this['partial']) {
            return;
        }

        // prevent access to __proto__
        // or any hidden object properties
        path = path.replace('__', '');

        // We don't want a slash as a prefix
        if (path[0] === '/') {
            path = path.substr(1);
        }

        path = Path.join(path, this['partial']);

        if (globals.handlebars.partials[path]) {
            return globals.handlebars.partials[path](this);
        }
    };
};

module.exports = [{
    name: 'dynamicComponent',
    factory: factory,
}];
