'use restrict';

const factory = globals => {
    return function(value) {
        var string = JSON.stringify(value, null, 2);

        string = globals.handlebars.Utils.escapeExpression(string);

        return '<pre>' + string + '</pre>';
    };
};

module.exports = [{
    name: 'pre',
    factory: factory,
}];
