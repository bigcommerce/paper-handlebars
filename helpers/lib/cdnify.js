'use strict';

// Return a function that can be used to translate paths to cdn paths
module.exports = globals => {
    /**
     * Add CDN base url to the relative path
     * @param  {String} path     Relative path
     * @return {String}          Url cdn
     */
    return function(path) {
        const siteSettings = globals.getSiteSettings();
        const themeSettings = globals.getThemeSettings();

        const cdnUrl = siteSettings.cdn_url || '';
        const versionId = siteSettings.theme_version_id;
        const editSessionId = siteSettings.theme_session_id;
        const cdnSettings = themeSettings.cdn;

        const protocolMatch = /(.*!?:)/;

        if (path instanceof globals.handlebars.SafeString) {
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

            if (cdnSettings) {
                var endpointKey = match[0].substr(0, match[0].length - 1);
                if (cdnSettings.hasOwnProperty(endpointKey)) {
                    if (cdnUrl) {
                        return [cdnSettings[endpointKey], path].join('/');
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

        if (editSessionId) {
            return [cdnUrl, 'stencil', versionId, 'e', editSessionId, path].join('/');
        }

        return [cdnUrl, 'stencil', versionId, path].join('/');
    };
};
