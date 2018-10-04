const Crypto = require('crypto');
const Renderer = require('../index');
const expect = require('code').expect;

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

// Return a function that is used to run through a set of test cases using renderString
function testRunner({context, siteSettings, themeSettings, templates, renderer}) {
    return (testCases, done) => {
        const promises = testCases.map(testCase => {
            const render = testCase.renderer ||
                           renderer ||
                           buildRenderer(testCase.siteSettings || siteSettings, 
                                         testCase.themeSettings || themeSettings,
                                         testCase.templates || templates);

            return render.renderString(testCase.input, testCase.context || context).then(result => {
                expect(result).to.be.equal(testCase.output);
            });
        });

        // Return a promise to run all the given test cases, then call done
        return Promise.all(promises).then(() => { done(); });
    }
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
    testRunner,
    randomString,
    randomInt,
};
