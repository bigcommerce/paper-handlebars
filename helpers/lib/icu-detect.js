'use strict';

const hasFullICU = (() => {
    try {
        const january = new Date(9e8);
        const spanish = new Intl.DateTimeFormat('es', { month: 'long' });
        return spanish.format(january) === 'enero';
    } catch (err) {
        return false;
    }
})();

module.exports = {
    hasFullICU
};
