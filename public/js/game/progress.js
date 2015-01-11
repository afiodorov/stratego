'use strict';
/*jslint node: true*/

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
  this.pendingActions.push(
    {'type': 'moveCard', 'destination': tile.name, 'piece': piece.name}
  );
};

/**
 */
Progress.prototype.clearPendingActions = function() {
  this.pendingActions = [];
};

/**
 */
module.exports = Progress;
