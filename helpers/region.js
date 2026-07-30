'use strict';

const factory = globals => {
    return function(params) {
        const regionId = params.hash.name;
        const regionTranslation = params.hash.translation;
        const contentRegions = globals.getContent();

        const applyModifierOrDefaultValue = (modifierVariable, defaultValue) => {
            if (typeof modifierVariable === 'undefined') {
                return defaultValue;
            }
            return !!modifierVariable; // Convert to boolean using truthiness.
        }

        const shouldUnwrap = applyModifierOrDefaultValue(params.hash.unwrapped, false);

        if (!contentRegions) { // If no regions at all, return empty string. Short circuit escape.
            return '';
        }

        // Construct the content to be returned as a string containing raw HTML.
        // Trim the string to remove any leading or trailing whitespace.
        const drawableContent = (contentRegions[regionId] || '').trim();


        let outputContent;
        if (shouldUnwrap) {
            // Return the content without the wrapper div.
            outputContent = drawableContent;
        } else {

            const wrapperDrawnAttributes = Object.values({
                "region_identifier": `data-content-region="${regionId}"`,
                "translation_data": regionTranslation && `data-content-region-translation="${regionTranslation}"`
                // More attributes can be added here if needed.
            }).filter(Boolean).join(' ');

            // Create the wrapper div with the regionId and translation data attribute.
            // This is the default behavior.
            outputContent = `<div ${wrapperDrawnAttributes}>${drawableContent}</div>`;
        }

        return new globals.handlebars.SafeString(outputContent);
    };
};

module.exports = [{
    name: 'region',
    factory: factory,
}];
