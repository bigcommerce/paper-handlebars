'use strict';

const factory = globals => {
    return function(params) {
        let regionId = params.hash.name;
        let contentRegions = globals.getContent();

        if (!contentRegions) {
            return '';
        }

        const content = `<div data-content-region="${regionId}">${contentRegions[regionId] || ''}</div>`;

        return new globals.handlebars.SafeString(content);
    };
};

module.exports = [{
    name: 'region',
    factory: factory,
}];
