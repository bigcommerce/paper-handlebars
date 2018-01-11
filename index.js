'use strict';

const _ = require('lodash');
const Logger = require('./lib/logger');
const HandlebarsV3 = require('handlebars');
const HandlebarsV4 = require('@bigcommerce/handlebars-v4');
const helpers = require('./helpers');

const handlebarsOptions = {
    preventIndent: true
};

// HandlebarsRenderer implements the interface Paper requires for its
// rendering needs, and does so with Handlebars.
class HandlebarsRenderer {
    /**
    * Constructor
    *
    * @param {Object} siteSettings - Global site settings, passed to helpers
    * @param {Object} themeSettings - Theme settings (configuration), passed to helpers
    * @param {String} hbVersion - Which version of handlebars to use. One of ['v3', 'v4'] - defaults to 'v3'.
    */
    constructor(siteSettings, themeSettings, hbVersion) {
        // Figure out which version of Handlebars to use.
        switch(hbVersion) {
            case 'v4':
                this.handlebars = HandlebarsV4.create();
                break;
            case 'v3':
            default:
                this.handlebars = HandlebarsV3.create();
                break;
        }

        this._translator = null;
        this._decorators = [];
        this._contentRegions = {};
        this._logger = new Logger();

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
     * Set the logger for us to use.
     *
     * @param {Object} An object that responds to `info`, `warn`, and `error`.
     */
    setLogger(logger) {
        this._logger = logger;
    };

    /**
     * Get logger
     *
     * @return {Object} Logger
     */
    logger() {
        return this._logger;
    };

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
     * Add templates to the active set of partials. The templates can either be raw
     * template strings, or the result coming from the preProcessor function.
     *
     * @param {Object} A set of templates to register with handlebars
     */
    addTemplates(templates) {
        _.each(templates, (template, path) => {
            // Don't do this work twice, first one wins.
            if (typeof this.handlebars.partials[path] !== 'undefined') {
                return;
            }

            // Check if it is a precompiled template
            try {
                // If precompiled, restore function
                template = this._tryRestoringPrecompiled(template);

                // Register it with handlebars
                this.handlebars.registerPartial(path, template);
            } catch(e) {
                // Swallow the error, but log it
                this.logger().error(e);
            }
        });
    };

    _tryRestoringPrecompiled(precompiled) {
        // Let's analyze the string to make sure it at least looks
        // something like a handlebars precompiled template. It should
        // be a string representation of an object containing a `main`
        // function and a `compiler` array. We do this because the next
        // step is a potentially dangerous eval.
        const re = /.*"compiler"\w*:\w*\[.*"main"\w*:\w*function/;
        if (!re.test(precompiled)) {
            // This is not a valid precompiled template, so this is
            // a raw template that can be registered directly.
            return precompiled;
        }

        // We need to take the string representation and turn it into a
        // valid JavaScript object. eval is evil, but necessary in this case.
        let template;
        eval(`template = ${precompiled}`);

        // Take the precompiled object and get the actual function out of it,
        // after first testing for runtime version compatibility.
        return this.handlebars.template(template);
    }

    /**
     * Detect whether a given template has been loaded.
     */
    isTemplateLoaded(path) {
        return typeof this.handlebars.partials[path] !== 'undefined';
    }

    /**
     * Return a function that performs any preprocessing we want to do on the templates.
     * In our case, run them through the Handlebars precompiler. This returns a string
     * representation of an object understood by Handlebars to be a precompiled template.
     */
    getPreProcessor() {
        return templates => {
            const processed = {};
            _.each(templates, (template, path) => {
                try {
                    processed[path] = this.handlebars.precompile(template, handlebarsOptions);
                } catch(e) {
                    // Swallow the error, but log it
                    this.logger().error(e);
                }
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
    render(path, context) {
        context = context || {};
        context.template = path;

        if (this._translator) {
            context.locale_name = this._translator.getLocale();
        }

        // Look up the template
        const template = this.handlebars.partials[path];
        if (typeof template === 'undefined') {
            // Swallow the error, but log it
            this.logger().error(`template not found: ${path}`);
            return '';
        }

        let output;
        try {
            // Render the template
            output = template(context);

            // Apply decorators
            _.each(this._decorators, fn => {
                output = fn(output);
            });
        } catch(e) {
            // Swallow the error, but log it
            this.logger().error(e);
            output = '';
        }

        return output;
    };

    /**
     * Renders a string with the given context
     *
     * @param  {String} template
     * @param  {Object} context
     * @return {String}
     */
    renderString(template, context) {
        context = context || {};

        try {
            return this.handlebars.compile(template)(context);
        } catch(e) {
            // Swallow the error, but log it
            this.logger().error(e);
            return '';
        }
    }
}

module.exports = HandlebarsRenderer;
