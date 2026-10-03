'use strict';

const utils = require('./3p/utils');
const common = require('./lib/common.js');

const factory = globals => {
    return function(name) {
        name = common.unwrapIfSafeString(globals.handlebars, name);
        if (!utils.isString(name)) {
            globals.getLogger().info("Non-string passed to block helper");
            return '';
        }

        if (Object.getOwnPropertyNames(Object.prototype).includes(name)) {
            globals.getLogger().info(`Invalid name '${name}' passed to the partial helper. Returning empty string.`);
            return '';
        }

        const options = arguments[arguments.length - 1];

        /* Look for partial by name. */
        const partial = globals.handlebars.partials[name] || options.fn;
        /*
         * Child `@` frame for the partial / fallback body. Only `@root` is forwarded
         * from the enclosing frame (options.data) into the block's own frame; no other
         * private variables are copied across the helper boundary.
         * handlebars.createFrame(base):
         *   1. shallow-copies `base` ({ root }) into a new object,
         *   2. sets `_parent` to `base`; overwritten below with the real enclosing
         *      frame, so explicit scope shifts (`@../index`) walk up to the parent.
         *      For a `{{#partial}}` body that parent is the frame at the
         *      `{{#block}}` call site (e.g. the layout), not where it was defined.
         * Hash args are then copied on top, so `{{#block "x" foo=1}}` exposes `@foo`.
         *
         * Side effects / things NOT forwarded:
         *   - enclosing `@index`, `@key`, `@first`, `@last`, custom `@vars` are not
         *     visible directly, e.g. a block inside `{{#each}}` sees an empty
         *     `@index`, but `@../index` returns the loop's index.
         *   - a hash arg named `root` (e.g. `root="x"`) shadows `@root`.
         *   - this used to be `{ data: options.hash }`, i.e. the frame was ONLY the
         *     hash args, with no `@root`. The hash still becomes `@` variables.
         * To make ALL enclosing `@` variables visible directly, use
         *   globals.handlebars.createFrame(options.data || {})
         * instead (it sets `_parent` itself), accepting that outer loop variables
         * then leak into the block.
         */
        const data = globals.handlebars.createFrame({ root: options.data && options.data.root });
        data._parent = options.data;
        return partial(this, { data: Object.assign(data, options.hash) });
    };
};

module.exports = [{
    name: 'block',
    factory: factory,
}];
