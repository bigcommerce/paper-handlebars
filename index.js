'use strict';

var _ = require('lodash');
var Translator = require('./lib/translator');
var Path = require('path');
var Fs = require('fs');
var Handlebars = require('handlebars');
var Async = require('async');
var helpers = [];
var handlebarsOptions = {
    preventIndent: true
};

// Load helpers (this only run once)
Fs.readdirSync(Path.join(__dirname, 'helpers')).forEach(function (file) {
    helpers.push(require('./helpers/' + file));
});

/**
* processor is an optional function to apply during template assembly. The
* templates parameter is a object where the keys are paths and the values are the
* raw templates. The function returns an object of the same format, possibly changing
* the values. We use this to precompile templates within the Paper module.
*
* @callback processor
* @param {Object} templates - Object that contains the gathered templates
*/

/**
* getTemplatesCallback is a function to call on completion of Assembler.getTemplates
*
* @callback getTemplatesCallback
* @param {Error} err - Error if it occurred, null otherwise
* @param {Object} templates - Object that contains the gathered templates, including processing
*/

/**
* getTranslationsCallback is a function to call on completion of Assembler.getTranslations
*
* @callback getTranslationsCallback
* @param {Error} err - Error if it occurred, null otherwise
* @param {Object} translations - Object that contains the translations
*/

/**
* Assembler.getTemplates assembles all the templates required to render the given
* top-level template.
*
* @callback assemblerGetTemplates
* @param {string} path - The path to the templates, relative to the templates directory
* @param {processor} processor - An optional processor to apply to each template during assembly
* @param {getTemplatesCallback} callback - Callback when Assembler.getTemplates is done.
*/

/**
* Assembler.getTranslations assembles all the translations for the theme.
*
* @callback assemblerGetTranslations
* @param {getTranslationsCallback} callback - Callback when Assembler.getTranslations is done.
*/

/**
* Paper constructor. In addition to store settings and theme settings (configuration),
* paper expects to be passed an assembler to gather all the templates required to render
* the top level template.
*
* @param {Object} settings - Site settings
* @param {Object} themeSettings - Theme settings (configuration)
* @param {Object} assembler - Assembler with getTemplates and getTranslations methods.
* @param {assemblerGetTemplates} assembler.getTemplates - Method to assemble templates
* @param {assemblerGetTranslations} assembler.getTranslations - Method to assemble translations
*/
class Paper {
    constructor(settings, themeSettings, assembler) {
        this.handlebars = Handlebars.create();

        this.handlebars.templates = {};
        this.translator = null;
        this.inject = {};
        this.decorators = [];

        this.settings = settings || {};
        this.themeSettings = themeSettings || {};
        this.assembler = assembler || {};
        this.contentServiceContext = {};

        helpers.forEach(helper => helper(this));
    }

    /**
     * Renders a string with the given context
     * @param  {String} string
     * @param  {Object} context
     */
    renderString(string, context) {
        return this.handlebars.compile(string)(context);
    }

    loadTheme(paths, acceptLanguage, done) {
        if (!_.isArray(paths)) {
            paths = paths ? [paths] : [];
        }

        Async.parallel([
            (next) => {
                this.loadTranslations(acceptLanguage, next);
            },
            (next) => {
                Async.map(paths, this.loadTemplates.bind(this), next);
            }
        ], done);
    }

    /**
     * Load Partials/Templates
     * @param  {Object}   templates
     * @param  {Function} callback
    */
    loadTemplates(path, callback) {
        let processor = this.getTemplateProcessor();

        this.assembler.getTemplates(path, processor, (error, templates) => {
            if (error) {
                return callback(error);
            }

            _.each(templates, (precompiled, path) => {
                var template;
                if (!this.handlebars.templates[path]) {
                    eval('template = ' + precompiled);
                    this.handlebars.templates[path] = this.handlebars.template(template);
                }
            });

            this.handlebars.partials = this.handlebars.templates;

            callback();
        });
    }

    getTemplateProcessor() {
        return (templates) => {
            let precompiledTemplates = {};

            _.each(templates,(content, path) => {
                precompiledTemplates[path] = this.handlebars.precompile(content, handlebarsOptions);
            });

            return precompiledTemplates;
        }
    }

    /**
     * Load Partials/Templates used for test cases and stencil-cli
     * @param  {Object}   templates
     * @return {Object}
     */
    loadTemplatesSync(templates) {
        _.each(templates,(content, fileName) => {
            this.handlebars.templates[fileName] = this.handlebars.compile(content, handlebarsOptions);
        });

        this.handlebars.partials = this.handlebars.templates;

        return this;
    };

    /**
     * @param {String} acceptLanguage
     * @param {Object} translations
     */
    loadTranslations(acceptLanguage, callback) {
        this.assembler.getTranslations((error, translations) => {
            if (error) {
                return callback(error);
            }

            // Make translations available to the helpers
            this.translator = Translator.create(acceptLanguage, translations);

            callback();
        });
    };

    /**
     * Add CDN base url to the relative path
     * @param  {String} path     Relative path
     * @return {String}          Url cdn
     */
    cdnify(path) {
        const cdnUrl = this.settings['cdn_url'] || '';
        const versionId = this.settings['theme_version_id'];
        const sessionId = this.settings['theme_session_id'];
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
     * @param {Function} decorator
     */
    addDecorator(decorator) {
        this.decorators.push(decorator);
    };

    /**
     * @param {String} path
     * @param {Object} context
     * @return {String}
     */
    render(path, context) {
        let output;

        context = context || {};
        context.template = path;

        if (this.translator) {
            context.locale_name = this.translator.getLocale();
        }

        output = this.handlebars.templates[path](context);

        _.each(this.decorators, function (decorator) {
            output = decorator(output);
        });

        return output;
    };

    /**
     * Theme rendering logic
     * @param  {String|Array} templatePath
     * @param  {Object} data
     * @return {String|Object}
     */
    renderTheme(templatePath, data) {
        let html;
        let output;

        // Is an ajax request?
        if (data.remote || _.isArray(templatePath)) {

            if (data.remote) {
                data.context = Object.assign({}, data.context, data.remote_data);
            }

            // Is render_with ajax request?
            if (templatePath) {
                // if multiple render_with
                if (_.isArray(templatePath)) {
                    // if templatePath is an array ( multiple templates using render_with option)
                    // compile all the template required files into a hash table
                    html = templatePath.reduce((table, file) => {
                        table[file] = this.render(file, data.context);
                        return table;
                    }, {});
                } else {
                    html = this.render(templatePath, data.context);
                }

                if (data.remote) {
                    // combine the context & rendered html
                    output = {
                        data: data.remote_data,
                        content: html
                    };
                } else {
                    output = html;
                }
            } else {
                output = {
                    data: data.remote_data
                };
            }
        } else {
            output = this.render(templatePath, data.context);
        }

        return output;
    }

}

module.exports = Paper;
