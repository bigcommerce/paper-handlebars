'use strict';

const factory = () => {
    return function(data) {
        if(typeof data === 'undefined') {
            throw new Error("Handlebars Helper 'json' does not allow value of 'undefined'");
        }
        return JSON.stringify(data);
    };
};

module.exports = [{
    name: 'json',
    factory: factory,
}];
