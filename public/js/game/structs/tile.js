'use strict';
/*jslint node: true*/
var callConstructor = require('../../lib/callConstructor.js');

var Tile = function(name, capacity, position) {
  if (!(this instanceof Tile)) {
    return callConstructor.apply(Tile, arguments);
  }

  this.name = name;
  this.capacity = capacity;
  this.position = position;
};

/**
 */
module.exports = Tile;
