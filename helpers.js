'use strict';

const fs = require('fs');
const Path = require('path');

let helpers = [];

// Load helpers
fs.readdirSync(Path.join(__dirname, 'helpers')).forEach(filename => {
    if (!fs.lstatSync(Path.join(__dirname, 'helpers', filename)).isDirectory()) {
        helpers = helpers.concat(require('./helpers/' + filename));
    }
});

// Load deprecated helpers
fs.readdirSync(Path.join(__dirname, 'helpers', 'deprecated')).forEach(filename => {
    if (!fs.lstatSync(Path.join(__dirname, 'helpers', 'deprecated', filename)).isDirectory()) {
        helpers = helpers.concat(require('./helpers/deprecated/' + filename));
    }
});

// Export full list of helpers
module.exports = helpers;
