'use strict';

function helper(paper) {
    paper.handlebars.registerHelper('json', function (data) {
        return JSON.stringify(data);
    });
}

module.exports = helper;
