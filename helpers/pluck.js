'use strict';

var _ = require('lodash');

function helper(paper) {
    paper.handlebars.registerHelper('pluck', function (collection, path) {
        return _.pluck(collection, path);
    });
}

module.exports = helper;
