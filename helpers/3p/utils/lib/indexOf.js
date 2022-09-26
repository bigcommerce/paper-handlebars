/*
* COPY of https://github.com/jonschlinkert/index-of/blob/0.2.0/index.js
*/


'use strict';

module.exports = function indexOf(arr, ele, start) {
  start = start || 0;
  var idx = -1;

  if (arr === null) {return idx;}
  var len = arr.length;
  var i = start < 0
    ? (len + start)
    : start;

  if (i >= arr.length) {
    return -1;
  }

  while (i < len) {
    if (arr[i] === ele) {
      return i;
    }
    i++;
  }

  return -1;
};