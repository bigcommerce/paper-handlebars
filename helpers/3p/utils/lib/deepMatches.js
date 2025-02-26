/**
 * Recursively compare objects
 */
const typeOf = require("./kindOf");

function deepMatches(val, value) {
  if (typeOf(val) === "object") {
    if (Array.isArray(val) && Array.isArray(value)) {
      return matchArray(val, value);
    } else {
      return matchObject(val, value);
    }
  } else {
    return isMatch(val, value);
  }
}

function containsMatch(array, value) {
  var len = array.length;
  var i = -1;

  while (++i < len) {
    if (deepMatches(array[i], value)) {
      return true;
    }
  }
  return false;
}

function matchArray(arr, value) {
  var len = value.length;
  var i = -1;

  while (++i < len) {
    if (!containsMatch(arr, value[i])) {
      return false;
    }
  }
  return true;
}

function matchObject(obj, value) {
  for (var key in value) {
    if (Object.hasOwnProperty.call(value, key)) {
      if (deepMatches(obj[key], value[key]) === false) {
        return false;
      }
    }
  }
  return true;
}

function isMatch(target, val) {
  return target === val;
}

module.exports = deepMatches;
