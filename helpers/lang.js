'use strict';

function helper(paper) {
    paper.handlebars.registerHelper('lang', function (translationKey) {
        const options = arguments[arguments.length - 1];

        if (paper.translator) {
            return paper.translator.translate(translationKey, options.hash);
        }

        return '';
    });
}

module.exports = helper;
