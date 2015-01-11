'use strict';
/*jslint node: true*/

var MoveCard = require('./../events/moveCard.js');
var _ = require('lodash');

/**
 * @constructor
 * @param {string} json
 * @param {GameManager} gameManager
 */
var Progress = function(json, gameManager) {
  this.json = json;
  this.gameManager = gameManager;
  this.pendingActions = [];

  Object.observe(this.pendingActions, this.gameManager.onPendingActionChange);
};

/**
 * @param {struct.Tile} tile
 * @param {struct.Piece} piece
 */
Progress.prototype.moveCard = function(tile, piece) {
  this.pendingActions.push(new MoveCard(tile.name, piece.name));
};

/**
 */
Progress.prototype.clearPendingActions = function() {
  this.pendingActions.splice(0, this.pendingActions.length);
};

/**
 */
module.exports = Progress;
