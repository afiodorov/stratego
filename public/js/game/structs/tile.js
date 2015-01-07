'use strict';
/*jslint node: true*/
var callConstructor = require('../../lib/callConstructor.js');

var Tile = function(name, maxCapacity, position) {
  if (!(this instanceof Tile)) {
    return callConstructor.apply(Tile, arguments);
  }

  this.name = name;
  this.maxCapacity = maxCapacity;
  this.position = position;
};

/**
 */
module.exports = Tile;
