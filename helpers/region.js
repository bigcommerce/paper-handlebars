'use strict';

function helper(paper) {
    paper.handlebars.registerHelper('region', function (params) {
        let regionId = params.hash.name;

        if (!paper.contentServiceContext.regions) {
            return '';
        }

        const content = `<div data-content-region="${regionId}">${paper.contentServiceContext.regions[regionId] || ''}</div>`;

        return new paper.handlebars.SafeString(content);
    });
}

module.exports = helper;
