'use strict';

const _ = require('lodash');
const Handlebars = require('handlebars');
const helpers = require('@bigcommerce/stencil-paper-handlebars-helpers');

const handlebarsOptions = {
    preventIndent: true
};

// HandlebarsRenderer implements the interface Paper requires for its
// rendering needs, and does so with Handlebars v3.
class HandlebarsRenderer {
    /**
    * Constructor
    *
    * @param {Object} siteSettings - Global site settings, passed to helpers
    * @param {Object} themeSettings - Theme settings (configuration), passed to helpers
    */
    constructor(siteSettings, themeSettings) {
        this.handlebars = Handlebars.create();
        this._translator = null;
        this._decorators = [];
        this._contentRegions = {};

        // Build global context for helpers
        this.helperContext = {
            siteSettings: siteSettings || {},
            themeSettings: themeSettings || {},
            handlebars: this.handlebars,
            getTranslator: this.getTranslator.bind(this),
            getContent: this.getContent.bind(this),
            storage: {}, // global storage used by helpers to keep state
        };

        // Register helpers with Handlebars
        helpers.forEach(spec => {
            this.handlebars.registerHelper(spec.name, spec.factory(this.helperContext));
        });
    }

    /**
     * Set the paper.Translator instance used to translate strings in helpers.
     *
     * @param {Translator} A paper.Translator instance used to translate strings in helpers
     */
    setTranslator(translator) {
        this._translator = translator;
    };

    /**
     * Get the paper.Translator instance used to translate strings in helpers.
     */
    getTranslator() {
        return this._translator;
    };

    /**
     * Add templates to the active set of partials. The templates passed in have been
     * run through the preProcessor function.
     *
     * @param {Object} A set of pre-processed templates to add to the active set of partials
     */
    addTemplates(templates) {
        _.each(templates, (precompiled, path) => {
            // Take precompiled template and convert it into something that can
            // be directly executed. Then, add it to the list of templates & partials.
            if (typeof this.handlebars.partials[path] === 'undefined') {
                let template;
                eval(`template = ${precompiled};`); // evil, but necessary :/
                this.handlebars.registerPartial(path, this.handlebars.template(template));
            }
        });
    };

    /**
     * Detect whether a given template has been loaded.
     */
    isTemplateLoaded(path) {
        return typeof this.handlebars.partials[path] !== 'undefined';
    }

    /**
     * Return a function that performs any preprocessing we want to do on the templates.
     * In our case, run them through the Handlebars precompiler.
     */
    getPreProcessor() {
        return templates => {
            const processed = {};
            _.forEach(templates, (template, path) => {
                processed[path] = this.handlebars.precompile(template, handlebarsOptions);
            });
            return processed;
        };
    }

    /**
     * Add a decorator to be applied at render time.
     *
     * @param {Function} decorator
     */
    addDecorator(decorator) {
        this._decorators.push(decorator);
    };

    /**
     * Add content regions to be used by the `region` helper.
     *
     * @param {Object} Regions with widgets
     */
    addContent(regions) {
        this._contentRegions = regions;
    };

    /**
     * Get content regions.
     *
     * @param {Object} Regions with widgets
     */
    getContent() {
        return this._contentRegions;
    };

    /**
     * Render a template with the given context
     *
     * @param {String} path
     * @param {Object} context
     * @return {String}
     */
    render(path, context = {}) {
        context.template = path;

        if (this._translator) {
            context.locale_name = this._translator.getLocale();
        }

        // Render the template
        let output = this.handlebars.partials[path](context);

        // Apply decorators
        _.each(this._decorators, function (decorator) {
            output = decorator(output);
        });

        return output;
    };

    /**
     * Renders a string with the given context
     *
     * @param  {String} string
     * @param  {Object} context
     * @return {String}
     */
    renderString(string, context = {}) {
        return this.handlebars.compile(string)(context);
    }
}

module.exports = HandlebarsRenderer;
