'use strict';

function helper(paper) {
    // https://github.com/danharper/Handlebars-Helpers/blob/master/src/helpers.js#L89
    paper.handlebars.registerHelper('nl2br', function (text) {
        var nl2br = (paper.handlebars.escapeExpression(text) + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + '<br>' + '$2');
        return new paper.handlebars.SafeString(nl2br);
    });
}

module.exports = helper;
