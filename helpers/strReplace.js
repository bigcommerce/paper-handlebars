'use strict';

const factory = () => {
    return function(str, substr, newSubstr, iteration) {
        if (typeof str !== 'string' || typeof substr !== 'string' || typeof newSubstr !== 'string') {
            return 'Invalid Input';
        }

        if (typeof iteration !== 'number') {
            return str.replace(new RegExp(escapeRegex(substr), 'g'), newSubstr);
        }

        const occurrence = getOccurrences(str, substr);

        if (iteration > 0 && occurrence > 0) {
            if (iteration >= occurrence) {
                return str.replace(new RegExp(escapeRegex(substr), 'g'), newSubstr);
            } else {
                let result = str;
                for (let i = 0; i < iteration; i++) {
                    result = result.replace(substr, newSubstr);
                }
                return result;
            }
        } else {
            return str;
        }
    };
};

function escapeRegex(string) {
    return string.replace(/[-\\^$*+?.()|[\]{}]/g, "\\$&");
}

function getOccurrences(str, substr) {
    const matches = str.match(new RegExp(escapeRegex(substr),'g'));
    return matches ? matches.length : 0;
}

module.exports = [{
    name: 'strReplace',
    factory: factory,
}];
