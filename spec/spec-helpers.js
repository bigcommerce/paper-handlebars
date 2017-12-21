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

module.exports = {
    buildRenderer,
    renderString,
    render,
};
