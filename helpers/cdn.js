'use strict';

function helper(paper) {
    paper.handlebars.registerHelper('cdn', function (assetPath) {
        return paper.cdnify(assetPath);
    });
}

module.exports = helper;
