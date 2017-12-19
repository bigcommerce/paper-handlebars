'use strict';

// https://github.com/danharper/Handlebars-Helpers/blob/master/src/helpers.js#L89
const factory = globals => {
    return function(text) {
        var nl2br = (globals.handlebars.escapeExpression(text) + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + '<br>' + '$2');
        return new globals.handlebars.SafeString(nl2br);
    };
};

module.exports = [{
    name: 'nl2br',
    factory: factory,
}];
