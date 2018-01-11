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

// Call the callback while capturing output to stdout
function capture(callback) {
    var captured = '';
    var intercept = require("intercept-stdout");
    var unhook_intercept = intercept(function(text) {
        captured += text;
    });

    callback();

    unhook_intercept();
    return captured;
}

module.exports = {
    buildRenderer,
    renderString,
    render,
    capture,
};
