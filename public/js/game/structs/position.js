'use strict';
/*jslint node: true*/
var callConstructor = require('../../lib/callConstructor.js');

var Position = function(row, col) {
  if (!(this instanceof Position)) {
    return callConstructor.apply(Position, arguments);
  }

  this.row = row;
  this.col = col;
};

/**
 */
module.exports = Position;
