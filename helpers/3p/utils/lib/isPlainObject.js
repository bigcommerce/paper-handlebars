function isObject(o) {
    return Object.prototype.toString.call(o) === '[object Object]';
  }
  
function isPlainObject(o) {
    var ctor,prot;

    if (isObject(o) === false) {return false;}

    // If has modified constructor
    ctor = o.constructor;
    if (ctor === undefined) {return true;}

    // If has modified prototype
    prot = ctor.prototype;
    if (isObject(prot) === false) {return false;}

    // If constructor does not have an Object-specific method
    if (Object.hasOwnProperty.call(prot, 'isPrototypeOf') === false) {
        return false;
    }

    // Most likely a plain Object
    return true;
};

module.exports = isPlainObject;
