'use strict';
var callConstructor = require('../../lib/callConstructor.js');

var Position = function(col, row) {
  if (!(this instanceof Position)) {
    return callConstructor.apply(Position, arguments);
  }

  this.col = col;
  this.row = row;
};

module.exports = Position;
