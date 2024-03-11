'use strict';

const factory = globals => {
    return function() {
        const params = globals.getRequestParams();
        if (params && params.security && params.security.nonce) {
            return ` nonce="${params.security.nonce}"`;
        }
        return ''
    };
};

module.exports = [{
    name: 'nonce',
    factory: factory,
}];
