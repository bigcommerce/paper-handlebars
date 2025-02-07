'use strict';

const factory = globals => {
    return function(params) {
        let regionId = params.hash.name;
        let regionTranslation = params.hash.translation;
        let regionEmpty = params.hash.empty; //Propal key of empty
        let regionRaw = params.hash.raw; //Propal key of raw
        let contentRegions = globals.getContent();

        if (!contentRegions) {
            return '';
        }

        // If content is empty, and flag to render nothing `empty` is set, then return nothing because there is nothing to render.
        if (!contentRegions[regionId] && regionEmpty) {
            return '';
        }

        //Write just the region content to the output variable.
        //If the flag is set for raw rendering, this will be the output.
        let content = contentRegions[regionId] || '';
        if (!regionRaw) {
            //Return the original structure that is typical of the {{region}} handlebars entity.
            const translationDataAttribute = regionTranslation ? ` data-content-region-translation="${regionTranslation}"` : '';
            //Original returned structure.
            content = `<div data-content-region="${regionId}"${translationDataAttribute}>${contentRegions[regionId] || ''}</div>`;
        }
        
        return new globals.handlebars.SafeString(content);
    };
};

module.exports = [{
    name: 'region',
    factory: factory,
}];
