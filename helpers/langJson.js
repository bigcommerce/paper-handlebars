'use strict';

function helper(paper) {
    paper.handlebars.registerHelper('langJson', function (keyFilter) {
        if (!paper.translator) {
            return '{}';
        }

        return JSON.stringify(paper.translator.getLanguage(keyFilter));
    });
}

module.exports = helper;
