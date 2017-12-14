'use strict';

function helper(paper) {
    paper.handlebars.registerHelper('snippet', function (location) {
        return '<!-- snippet location ' + location + ' -->';
    });
}

module.exports = helper;
