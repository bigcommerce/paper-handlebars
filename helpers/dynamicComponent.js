'use strict';

const Path = require('path');

const factory = globals => {
    return function(path) {
        if (!this['partial']) {
            return;
        }

        // prevent access to __proto__
        // or any hidden object properties
        path = path.replace('__', '');

        // We don't want a slash as a prefix
        if (path[0] === '/') {
            path = path.substr(1);
        }

        path = Path.join(path, this['partial']);

        if (globals.handlebars.partials[path] && Object.hasOwnProperty.call(globals.handlebars.partials, path)) {
            /*
             * KNOWN VARIATION: `@root` inside a dynamic component is NOT the page.
             *
             * The partial is called directly with no `data`, so Handlebars treats the
             * call as a fresh top-level render and sets `@root` to `this` (the current
             * item, e.g. the loop entry). Every other path gives `@root` = the page
             * context, as asserted for every block helper in
             * spec/helpers/blockHelpersRoot.js, and as the native `{{> partial}}`
             * syntax does. Inside `{{#each items}}`, a component rendering
             * `[{{@root.title}}|{{@index}}|{{title}}]` gives (v3 and v4 alike):
             *   {{> components/card}}                -> [PAGE|0|ITEM0]
             *   {{{dynamicComponent "components"}}}  -> [ITEM0||ITEM0]
             * Also as a result: no enclosing `@` variables (`@index`, `@key`, ...)
             * and no `@../` scope shifts are available inside the component.
             *
             */
            return globals.handlebars.partials[path](this);
        }
    };
};

module.exports = [{
    name: 'dynamicComponent',
    factory: factory,
}];
