'use strict';

const _ = require('lodash');
const Fs = require('fs');
const Handlebars = require('handlebars');
const Path = require('path');

const helpers = [];
const handlebarsOptions = {
    preventIndent: true
};

// Load helpers (this is run once on module initialization)
Fs.readdirSync(Path.join(__dirname, 'helpers')).forEach(function (file) {
    helpers.push(require('./helpers/' + file));
});

class HandlebarsRenderer {
    /**
    * Constructor
    *
    * @param {Object} siteSettings - Global site settings
    * @param {Object} themeSettings - Theme settings (configuration)
    */
    constructor(siteSettings, themeSettings) {
        this.siteSettings = siteSettings || {};
        this.themeSettings = themeSettings || {};

        this.handlebars = Handlebars.create();

        this.translator = null;
        this.decorators = [];
        this.contentRegions = {};

        this.inject = {}; // TODO: move this into helper

        // Register helpers with Handlebars.
        helpers.forEach(helper => helper(this)); // TODO: reduce coupling
    }

    /**
     * @param {Translator} A paper.Translator instance used to translate strings in helpers
     */
    setTranslator(translator) {
        this.translator = translator;
    };

    /**
     * @param {Object} A set of pre-processed templates to add to the active set of partials
     */
    addTemplates(templates) {
        _.each(templates, (precompiled, path) => {
            // Take precompiled template and convert it into something that can
            // be directly executed. Then, add it to the list of templates & partials.
            if (typeof this.handlebars.partials[path] === 'undefined') {
                let template;
                eval(`template = ${precompiled};`); // evil
                this.handlebars.registerPartial(path, this.handlebars.template(template));
            }
        });
    };

    isTemplateLoaded(path) {
        return typeof this.handlebars.partials[path] !== 'undefined';
    }

    /**
     * Return a function that returns the given templates in a precompiled form.
     */
    getPreProcessor() {
        return templates => {
            let precompiled = {};

            _.each(templates, (content, path) => {
                precompiled[path] = this.handlebars.precompile(content, handlebarsOptions);
            });

            return precompiled;
        };
    }

    /**
     * @param {Function} decorator
     */
    addDecorator(decorator) {
        this.decorators.push(decorator);
    };

    /**
     * @param {Object} Regions with widgets
     */
    addContent(regions) {
        this.contentRegions = regions;
    };

    getContent() {
        return this.contentRegions;
    };

    /**
     * Add CDN base url to the relative path
     * @param  {String} path     Relative path
     * @return {String}          Url cdn
     */
    cdnify(path) {
        const cdnUrl = this.siteSettings['cdn_url'] || '';
        const versionId = this.siteSettings['theme_version_id'];
        const sessionId = this.siteSettings['theme_session_id'];
        const protocolMatch = /(.*!?:)/;

        if (path instanceof Handlebars.SafeString) {
            path = path.string;
        }

        if (!path) {
            return '';
        }

        if (/^(?:https?:)?\/\//.test(path)) {
            return path;
        }

        if (protocolMatch.test(path)) {
            var match = path.match(protocolMatch);
            path = path.slice(match[0].length, path.length);

            if (path[0] === '/') {
                path = path.slice(1, path.length);
            }

            if (match[0] === 'webdav:') {
                return [cdnUrl, 'content', path].join('/');
            }

            if (this.themeSettings.cdn) {
                var endpointKey = match[0].substr(0, match[0].length - 1);
                if (this.themeSettings.cdn.hasOwnProperty(endpointKey)) {
                    if (cdnUrl) {
                        return [this.themeSettings.cdn[endpointKey], path].join('/');
                    }

                    return ['/assets/cdn', endpointKey, path].join('/');
                }
            }

            if (path[0] !== '/') {
                path = '/' + path;
            }

            return path;
        }

        if (path[0] !== '/') {
            path = '/' + path;
        }

        if (!versionId) {
            return path;
        }

        if (path.match(/^\/assets\//)) {
            path = path.substr(8, path.length);
        }

        if (sessionId) {
            return [cdnUrl, 'stencil', versionId, 'e', sessionId, path].join('/');
        }

        return [cdnUrl, 'stencil', versionId, path].join('/');
    };

    /**
     * @param {String} path
     * @param {Object} context
     * @return {String}
     */
    render(path, context) {
        context = context || {};
        context.template = path;

        if (this.translator) {
            context.locale_name = this.translator.getLocale();
        }

        let output = this.handlebars.partials[path](context);

        _.each(this.decorators, function (decorator) {
            output = decorator(output);
        });

        return output;
    };

    /**
     * Renders a string with the given context
     * @param  {String} string
     * @param  {Object} context
     */
    renderString(string, context) {
        return this.handlebars.compile(string)(context);
    }
}

module.exports = HandlebarsRenderer;
