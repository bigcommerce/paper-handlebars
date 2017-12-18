const fs = require('fs');
const Path = require('path');

let helpers = [];

// Load helpers
fs.readdirSync(__dirname).forEach(filename => {
    if (filename !== 'index.js' && !fs.lstatSync(Path.join(__dirname, filename)).isDirectory()) {
        helpers = helpers.concat(require('./' + filename));
    }
});

// Load deprecated helpers
fs.readdirSync(Path.join(__dirname, 'deprecated')).forEach(filename => {
    if (!fs.lstatSync(Path.join(__dirname, 'deprecated', filename)).isDirectory()) {
        helpers = helpers.concat(require('./deprecated/' + filename));
    }
});

// Export full list of helpers
module.exports = helpers;
