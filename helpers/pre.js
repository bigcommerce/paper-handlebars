'use restrict';

function helper(paper) {
    paper.handlebars.registerHelper('pre', function (value) {
        var string = JSON.stringify(value, null, 2);

        string = paper.handlebars.Utils.escapeExpression(string);

        return '<pre>' + string + '</pre>';
    });
}

module.exports = helper;
