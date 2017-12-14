'use strict';

/**
 * @module paper/lib/logger
 */

/**
 * Log message
 * @returns {void}
 */
function log() {
    console.log.apply(console, arguments);
}

/**
* Log error message
* @returns {void}
*/
function logError() {
    console.error.apply(console, arguments);
}

module.exports = {
    log: log,
    logError: logError,
};
