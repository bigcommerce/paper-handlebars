'use strict';

const Path = require('path');

const factory = globals => {
    return function(path) {
        if (!this['partial']) {
            return;
        }

        console.log(path);
        // prevent access to __proto__
        // or any hidden object properties
        path = path.replace('__', '');
        console.log(path);

        // We don't want a slash as a prefix
        if (path[0] === '/') {
            path = path.substr(1);
        }
        console.log(this['partial']);

        path = Path.join(path, this['partial']);
        console.log('path');
        console.log(path);
        console.log(Object.keys(globals.handlebars.partials));
        console.log(globals.handlebars.partials[path]);

        if (globals.handlebars.partials[path] && Object.hasOwnProperty.call(globals.handlebars.partials, path)) {
            return globals.handlebars.partials[path](this);
        }
    };
};

module.exports = [{
    name: 'dynamicComponent',
    factory: factory,
}];
