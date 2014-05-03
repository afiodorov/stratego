'use strict';
var negate = function(func) {
  return function() {
    return !func.apply(null, arguments);
  };
};

module.exports = negate;
