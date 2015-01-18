'use strict';
/*jslint node: true*/

var _ = require('lodash');
var isInitPlacementCorrect = function(boardState) {
  var self = this;
  var numPiecesOnTiles = _.mapValues(boardState, function(value) {
    return value.length;});
  return _.isEqual(self._initialPlacement,
    _.omit(numPiecesOnTiles, function(val) {return val === 0;})
  );
};

var Rules = function() {
  return this;
};

/**
 * @param {struct.Pile} piece
 * @return {array.<string>}
 */
Rules.prototype.getAvailTiles = function(piece) {
  var self = this;
  if (piece.side === this.progress.json.side) {
    return _.keys(self._initialPlacement);
  }

  return [];
};

/**
 * @param {struct.Tile} tile see structs/tiles.js
 * @return {number} capacity of the tile
 */
Rules.prototype.getTileCapacity = function(tile) {
  var self = this;

  var tileName = tile.name;
  if (self._initialPlacement[tileName]) {
    return self._initialPlacement[tileName];
  }

  return 0;
};

/**
 * @param {boardState} boardState
 * @return {boolean}
 */
Rules.prototype.isReadyToSubmit = isInitPlacementCorrect;

/**
 */
module.exports = Rules;
