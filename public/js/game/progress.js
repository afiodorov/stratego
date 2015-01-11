'use strict';
/*jslint node: true*/

var MoveCardEvent = require('./../events/moveCard.js');
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
  this.pendingActions.push(new MoveCardEvent(tile.name, piece.name));
};

/**
 * @param {struct.Tile} tile
 * @param {struct.Piece} piece
 */
Progress.prototype.cancelMoveCard = function(tile, piece) {
  var actionIndex = _.findIndex(this.pendingActions,
    _.partial(_.isEqual, new MoveCardEvent(tile.name, piece.name)));

  if (actionIndex > -1) {
    this.pendingActions.splice(actionIndex, 1);
  }
};

/**
 */
Progress.prototype.clearPendingActions = function() {
  this.pendingActions.splice(0, this.pendingActions.length);
};

/**
 */
module.exports = Progress;
