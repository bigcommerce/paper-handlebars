const Crypto = require('crypto');
const Renderer = require('../index');

function buildRenderer(siteSettings, themeSettings, templates) {
    siteSettings = siteSettings || {};
    themeSettings = themeSettings || {};
    const renderer = new Renderer(siteSettings, themeSettings);

    // Register templates
    if (typeof templates !== 'undefined') {
        templates = renderer.getPreProcessor()(templates);
        renderer.addTemplates(templates);
    }

    return renderer;
}

function renderString(template, context, siteSettings, themeSettings, templates) {
    const renderer = buildRenderer(siteSettings, themeSettings, templates);
    return renderer.renderString(template, context);
}

function render(template, context, siteSettings, themeSettings, templates) {
    const renderer = buildRenderer(siteSettings, themeSettings, templates);
    return renderer.render(template, context);
}

// Return a random string
function randomString() {
    return Crypto.randomBytes(10).toString('hex');
}

// Return a random integer
function randomInt(low, high) {
    low = low || 0;
    high = high || 1e9;
    return Math.floor(Math.random() * (high - low) + low);
}

module.exports = {
    buildRenderer,
    renderString,
    render,
    randomString,
    randomInt,
};
