'use strict';
/*jslint node: true*/

/**
 * @constructor
 * @param {string} destination
 * @param {string} pieceName
 */
var MoveCard = function(destination, pieceName) {
  this.type = 'moveCard';
  this.destination = destination;
  this.piece = pieceName;
};

/**
 */
module.exports = MoveCard;
