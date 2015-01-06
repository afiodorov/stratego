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
 * @return {array.<string>}
 */
lightPiecesPlacementRules.prototype.getAvailTiles = function() {
  return _.keys(initialPlacement);
};

/**
 * @param {string} tileName see structs/tiles.js
 * @return {number} capacity of the tile
 */
lightPiecesPlacementRules.prototype.getTileCapacity = function(tileName) {
  if (initialPlacement[tileName]) {
    return initialPlacement[tileName];
  }

  return 0;
};

/**
 */
module.exports = lightPiecesPlacementRules;
