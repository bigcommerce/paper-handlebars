'use strict';

function helper(paper) {
    paper.handlebars.registerHelper('helperMissing', function () {
        return undefined;
    });
}

module.exports = helper;
