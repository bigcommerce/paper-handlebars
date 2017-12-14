'use strict';

var _ = require('lodash');

function helper(paper) {
    paper.handlebars.registerHelper('pick', function () {
        return _.pick.apply(null, arguments);
    });

    /**
     * @deprecate Use lang + concat
     */
    paper.handlebars.registerHelper('getShortMonth', function (index) {

        switch (index) {
        case 1:
            return 'Jan';
        case 2:
            return 'Feb';
        case 3:
            return 'Mar';
        case 4:
            return 'Apr';
        case 5:
            return 'May';
        case 6:
            return 'Jun';
        case 7:
            return 'Jul';
        case 8:
            return 'Aug';
        case 9:
            return 'Sep';
        case 10:
            return 'Oct';
        case 11:
            return 'Nov';
        case 12:
            return 'Dec';
        }

        return '';
    });

    /**
     * @deprecate Use {{#if val1 '==' val2}}...{{/if}}
     */
    paper.handlebars.registerHelper('equals', function (val1, val2) {
        const options = arguments[arguments.length - 1];

        if (val1 != val2) {
            return '';
        }

        return options.fn();
    });

    /**
     * @deprecate Use {{#for start end (context)}}...{{/for}}
     */
    paper.handlebars.registerHelper('enumerate', function (start, end) {
        const options = arguments[arguments.length - 1];
        var out = '';
        var i = start;

        for (i; i <= end; i++) {
            out = out + options.fn(i);
        }

        return out + '';
    });
}

module.exports = helper;
