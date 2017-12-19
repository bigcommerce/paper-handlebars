'use strict';

const _ = require('lodash');

const factory = globals => {
    return function(params) {
        let regionId = params.hash.name;
        let contentRegions = globals.getContent();

        if (_.keys(contentRegions).length === 0) {
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
