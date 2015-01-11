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

var isInitPlacementCorrect = function(boardState) {
  var numPiecesOnTiles = _.mapValues(boardState, function(value) {
    return value.length;});
  return _.isEqual(initialPlacement,
    _.omit(numPiecesOnTiles, function(val) {return val === 0;})
  );
};

var rules = function(progress) {
  this.progress = progress;
};

/**
 * @param {struct.Pile} piece
 * @return {array.<string>}
 */
rules.prototype.getAvailTiles = function(piece) {
  if (piece.side === this.progress.json.side) {
    return _.keys(initialPlacement);
  }

  return [];
};

/**
 * @param {struct.Tile} tile see structs/tiles.js
 * @return {number} capacity of the tile
 */
rules.prototype.getTileCapacity = function(tile) {
  var tileName = tile.name;
  if (initialPlacement[tileName]) {
    return initialPlacement[tileName];
  }

  return 0;
};

/**
 * @param {boardState} boardState
 * @return {boolean}
 */
rules.prototype.isReadyToSubmit = isInitPlacementCorrect;

/**
 */
module.exports = rules;
