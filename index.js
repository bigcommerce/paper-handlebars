'use strict';
const HandlebarsV3 = require('handlebars');
const HandlebarsV4 = require('@bigcommerce/handlebars-v4');
const helpers = require('./helpers');

const AppError = require('./lib/appError');
class CompileError extends AppError {};          // Error compiling template
class FormatError extends AppError {};           // Error restoring precompiled template
class RenderError extends AppError {};           // Error rendering template
class DecoratorError extends AppError {};        // Error applying decorator
class TemplateNotFoundError extends AppError {}; // Template not registered

const handlebarsOptions = {
    preventIndent: true
};

// HandlebarsRenderer implements the interface Paper requires for its
// rendering needs, and does so with Handlebars.
class HandlebarsRenderer {
    // Add static accessor to reference custom errors
    static get errors() {
        return {
            CompileError,
            FormatError,
            RenderError,
            DecoratorError,
            TemplateNotFoundError,
        };
    }

    /**
    * Constructor
    *
    * @param {Object} siteSettings - Global site settings, passed to helpers
    * @param {Object} themeSettings - Theme settings (configuration), passed to helpers
    * @param {String} hbVersion - Which version of handlebars to use. One of ['v3', 'v4'] - defaults to 'v3'.
    * @param {Object} logger - A console-like object to use for logging
    */
    constructor(siteSettings, themeSettings, hbVersion, logger = console) {
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

        this.logger = logger;
        this._setHandlebarsLogger();
        this.setSiteSettings(siteSettings || {});
        this.setThemeSettings(themeSettings || {});
        this.setTranslator(null);
        this.setContent({});
        this.resetDecorators();

        // Build global context for helpers
        this.helperContext = {
            handlebars: this.handlebars,
            getSiteSettings: this.getSiteSettings.bind(this),
            getThemeSettings: this.getThemeSettings.bind(this),
            getTranslator: this.getTranslator.bind(this),
            getContent: this.getContent.bind(this),
            storage: {}, // global storage used by helpers to keep state
        };

        // Register helpers with Handlebars
        for (let i = 0; i < helpers.length; i++) {
            const spec = helpers[i];
            this.handlebars.registerHelper(spec.name, spec.factory(this.helperContext));
        }
    }

    /**
     * Set the paper.Translator instance used to translate strings in helpers.
     *
     * @param {Translator} translator A paper.Translator instance used to translate strings in helpers
     */
    setTranslator(translator) {
        this._translator = translator;
    };

    /**
     * Get the paper.Translator instance used to translate strings in helpers.
     *
     * @return {Translator} A paper.Translator instance used to translate strings in helpers
     */
    getTranslator() {
        return this._translator;
    };

    /**
     * Set the siteSettings object containing global site settings.
     *
     * @param {object} settings An object containing global site settings.
     */
    setSiteSettings(settings) {
        this._siteSettings = settings;
    };

    /**
     * Get the siteSettings object containing global site settings.
     *
     * @return {object} settings An object containing global site settings.
     */
    getSiteSettings() {
        return this._siteSettings;
    };

    /**
     * Set the themeSettings object containing the theme configuration.
     *
     * @param {object} settings An object containing the theme configuration.
     */
    setThemeSettings(settings) {
        this._themeSettings = settings;
    };

    /**
     * Get the themeSettings object containing the theme configuration.
     *
     * @return {object} settings An object containing the theme configuration.
     */
    getThemeSettings() {
        return this._themeSettings;
    };

    /**
     * Reset decorator list.
     */
    resetDecorators() {
        this._decorators = [];
    };

    /**
     * Add a decorator to be applied at render time.
     *
     * @param {Function} decorator
     */
    addDecorator(decorator) {
        this._decorators.push(decorator);
    };

    /**
     * Setup content regions to be used by the `region` helper.
     *
     * @param {Object} Regions with widgets
     */
    setContent(regions) {
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
     * Add templates to the active set of partials. The templates can either be raw
     * template strings, or the result coming from the preProcessor function.
     *
     * @param {Object} A set of templates to register with handlebars
     */
    addTemplates(templates) {
        const paths = Object.keys(templates);

        for (let i = 0; i < paths.length; i++) {
            const path = paths[i];

            if (typeof this.handlebars.partials[path] !== 'undefined') {
                continue;
            }

            try {
                // Check if it is a precompiled template
                const template = this._tryRestoringPrecompiled(templates[path]);

                // Register it with handlebars
                this.handlebars.registerPartial(path, template);
            } catch(e) {
                throw new FormatError(e.message);
            }
        }
    };

    _tryRestoringPrecompiled(precompiled) {
        // Let's analyze the string to make sure it at least looks
        // something like a handlebars precompiled template. It should
        // be a string representation of an object containing a `main`
        // function and a `compiler` array. We do this because the next
        // step is a potentially dangerous eval.
        const re = /"compiler":\[.*\],"main":function/;
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
            const paths = Object.keys(templates);
            const processed = {};

            for (let i = 0; i < paths.length; i++) {
                const path = paths[i];
                try {
                    processed[path] = this.handlebars.precompile(templates[path], handlebarsOptions);
                } catch(e) {
                    throw new CompileError(e.message, { path });
                }
            }
            return processed;
        };
    }

    /**
     * Render a template with the given context
     *
     * @param {String} path The path to the template
     * @param {Object} context The context to provide to the template
     * @return {Promise} A promise to return the rendered template
     * @throws [TemplateNotFoundError|RenderError|DecoratorError]
     */
    render(path, context) {
        return new Promise((resolve, reject) => {
            context = context || {};

            // Add some data to the context
            context.template = path;
            if (this._translator) {
                context.locale_name = this._translator.getLocale();
            }

            // Look up the template
            const template = this.handlebars.partials[path];
            if (typeof template === 'undefined') {
                return reject(new TemplateNotFoundError(`template not found: ${path}`));
            }

            // Render the template
            let result;
            try {
                result = template(context);
            } catch(e) {
                return reject(new RenderError(e.message));
            }

            // Apply decorators
            try {
                for (let i = 0; i < this._decorators.length; i++) {
                    result = this._decorators[i](result);
                }
            } catch(e) {
                return reject(new DecoratorError(e.message));
            }

            resolve(result);
        });
    };

    /**
     * Renders a string with the given context
     *
     * @param  {String} template
     * @param  {Object} context
     * @return {String}
     * @throws [CompileError|RenderError]
     */
    renderString(template, context) {
        return new Promise((resolve, reject) => {
            context = context || {};

            // Compile the template
            try {
                template = this.handlebars.compile(template);
            } catch(e) {
                return reject(new CompileError(e.message));
            }

            // Render the result
            let result;
            try {
                result = template(context);
            } catch(e) {
                return reject(new RenderError(e.message));
            }

            resolve(result);
        });
    }

    /**
     * Internal method. Set the Handlebars logger to use the given console alternative. This is an override
     * of https://github.com/wycats/handlebars.js/blob/148b19182d70278237a62d8293db540483a0c46c/lib/handlebars/logger.js#L22
     */
    _setHandlebarsLogger() {
        // Normalize on the v4 implementation
        this.handlebars.logger = HandlebarsV4.logger;

        // Override logger.log to use the given console alternative
        this.handlebars.log = this.handlebars.logger.log = (level, ...message) => {
            level = this.handlebars.logger.lookupLevel(level);

            if (this.handlebars.logger.lookupLevel(this.handlebars.logger.level) <= level) {
                let method = this.handlebars.logger.methodMap[level];
                if (typeof this.logger[method] !== 'function') {
                    method = 'log';
                }
                this.logger[method](...message);
            }
        };
    }
}

module.exports = HandlebarsRenderer;
