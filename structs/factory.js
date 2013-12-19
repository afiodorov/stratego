"use strict";
function makeStruct(names_) {
  var names = names_.split(' ');
  var count = names_.length;
  function constructor() {
    for (var i = 0; i < count; i++) {
      this[names[i]] = arguments[i];
    }
  }
  return constructor;
}

module.exports = {
  makeStruct : makeStruct
};
