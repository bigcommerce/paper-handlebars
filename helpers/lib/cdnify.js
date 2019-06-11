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

        if (path instanceof globals.handlebars.SafeString) {
            path = path.string;
        }

        if (!path) {
            return '';
        }

        if (path.startsWith('https://') || path.startsWith('http://') || path.startsWith('//')) {
            return path;
        }
        // This block is to strip leading . and / from path
        if (['.', '/'].includes(path[0])) {
            for (let i = 0; i < path.length; i++) {
                if (path[i] !== '.' && path[i] !== '/') {
                    path = path.slice(i);
                    break;
                }
            }
        }

        let colonIndex = path.indexOf(':');

        if (colonIndex !== -1) {
            while (colonIndex + 1 < path.length && path[colonIndex + 1] === ':') {
                colonIndex++;
            }
            const protocol = path.slice(0, colonIndex + 1);
            path = path.slice(colonIndex + 1);
            //This block is to strip leading / from path
            if (path[0] === '/') {
                for (let i = 1; i < path.length; i++) {
                    if (path[i] !== '/') {
                        path = path.slice(i);
                        break;
                    }
                }
            }

            if (protocol === 'webdav:') {
                return [cdnUrl, 'content', path].join('/');
            }

            if (cdnSettings) {
                const endpointKey = protocol.slice(0, protocol.length - 1);
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

        if (!versionId) {
            if (path[0] !== '/') {
                path = '/' + path;
            }
            return path;
        }

        if (path[0] === '/') {
            path = path.slice(1);
        }

        if (path.startsWith('assets/')) {
            path = path.slice(7);
        }

        if (editSessionId) {
            return [cdnUrl, 'stencil', versionId, 'e', editSessionId, path].join('/');
        }

        return [cdnUrl, 'stencil', versionId, path].join('/');
    };
};
