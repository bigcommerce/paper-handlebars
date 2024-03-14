'use strict';

const factory = globals => {
    return function() {
        const params = globals.getRequestParams();
        if (params && params.security && params.security.nonce) {
            return new globals.handlebars.SafeString(` nonce="${params.security.nonce}"`);
        }
        return ''
    };
};

module.exports = [{
    name: 'nonce',
    factory: factory,
}];
