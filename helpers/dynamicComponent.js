'use strict';

var Path = require('path');

function helper(paper) {
    paper.handlebars.registerHelper('dynamicComponent', function (path) {
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

        if (paper.handlebars.partials[path]) {

            return paper.handlebars.partials[path](this);
        }
    });
}

module.exports = helper;
