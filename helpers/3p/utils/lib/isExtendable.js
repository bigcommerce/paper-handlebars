const isPlainObject = require('./isPlainObject');

module.exports = function isExtendable(val) {
    return isPlainObject(val) || typeof val === 'function' || Array.isArray(val);
};