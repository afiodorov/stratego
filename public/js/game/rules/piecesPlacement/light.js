'use strict';
/*jslint node: true*/

var _ = require('lodash');

var initialPlacement = {
  'Mordor': 4,
  'Gondor': 1,
  'Dagorlad' : 1,
  'Mirkwood' : 1,
  'Fangorn' : 1,
  'Rohan' : 1
};

var lightPiecesPlacementRules = function(progress) {
  this.progress = progress;
};

/**
 * @param {struct.Pile} piece
 * @return {array.<string>}
 */
lightPiecesPlacementRules.prototype.getAvailTiles = function(piece) {
  if (piece.side === this.progress.json.side) {
    return _.keys(initialPlacement);
  }

  return [];
};

/**
 * @param {struct.Tile} tile see structs/tiles.js
 * @return {number} capacity of the tile
 */
lightPiecesPlacementRules.prototype.getTileCapacity = function(tile) {
  var tileName = tile.name;
  if (initialPlacement[tileName]) {
    return initialPlacement[tileName];
  }

  return 0;
};

/**
 */
module.exports = lightPiecesPlacementRules;
