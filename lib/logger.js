'use strict';

class Logger {
    constructor() {}

    emerg(message) {
        console.error(message);
    }

    alert(message) {
        console.error(message);
    }

    crit(message) {
        console.error(message);
    }

    error(message) {
        console.error(message);
    }

    warn(message) {
        console.warn(message);
    }

    notice(message) {
        console.info(message);
    }

    info(message) {
        console.info(message);
    }

    debug(message) {
        console.log(message);
    }
}

module.exports = Logger;
