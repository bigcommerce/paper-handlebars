'use strict';
const SafeString = require('handlebars').SafeString;

const factory = () => {
    return function(data) {
        if (data instanceof SafeString) {
            data = data.toString();
        }
        return JSON.stringify(data);
    };
};

module.exports = [{
    name: 'json',
    factory: factory,
}];
