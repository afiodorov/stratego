'use strict';

var callConstructor = function() {
  var Constructor = this;
  var instance = Object.create(Constructor.prototype);
  var retObject = Constructor.apply(instance, arguments);
  return Object(retObject) === retObject ? retObject : instance;
};

module.exports = callConstructor;
