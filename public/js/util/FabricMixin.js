'use strict';
/*jslint node: true*/

/**
 * @constructor
 */
var FabricMixin = function() {
  return this;
};

/**
 * @param {fabric.Object} fabricObject
 */
FabricMixin.prototype.linkFabric = function(fabricObject) {

  fabricObject.holder = this;
  this.fabricObj = fabricObject;
};

/**
 */
module.exports = FabricMixin;
