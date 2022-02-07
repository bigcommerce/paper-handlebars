'use strict';

const factory = () => {
    return function(string, substr, newSubstr, token) {
        if (typeof string !== 'string' || typeof substr !== 'string' || typeof newSubstr !== 'string') {
            return 'Invalid Input';
        }

        if (token && typeof token === 'string') {
            return string.replace(new RegExp(escapeRegex(substr), token), newSubstr);
        } else {
            return string.replace(new RegExp(escapeRegex(substr), 'g'), newSubstr);
        }

    };
};

function escapeRegex(string) {
    return string.replace(/[-\\^$*+?.()|[\]{}]/g, "\\$&");
}

module.exports = [{
    name: 'strReplace',
    factory: factory,
}];
