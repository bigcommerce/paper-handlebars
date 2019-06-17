function isObject(val) {
    return val !== null && typeof val === 'object';
}

function isOptions(val) {
    return isObject(val) && val.fn;
}

function isString(val) {
    return typeof val === 'string';
}

function isEmptyObject(val) {
    return isObject(val) && Object.keys(val).length === 0;
}

function isTruthy(val) {
    if (Array.isArray(val)) {
        return !!val.length;
    } else if (isEmptyObject(val)) {
        return false;
    } else {
        return !!val;
    }
}

module.exports = {
    isObject, 
    isOptions, 
    isString, 
    isEmptyObject,
    isTruthy
};