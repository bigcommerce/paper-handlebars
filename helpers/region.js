'use strict';

const factory = globals => {
    return function(params) {
        let regionId = params.hash.name;
        let regionTranslation = params.hash.translation;
        let contentRegions = globals.getContent();

        if (!contentRegions) {
            return '';
        }
        const translationDataAttribute = regionTranslation ? ` data-content-region-translation="${regionTranslation}"` : '';

        const content = `<div data-content-region="${regionId}"${translationDataAttribute}>${contentRegions[regionId] || ''}</div>`;

        return new globals.handlebars.SafeString(content);
    };
};

module.exports = [{
    name: 'region',
    factory: factory,
}];
