/*global module*/
'use strict';

var _ = require('lodash');

var InterfaceManager = function(canvas) {
  this.canvas = canvas;
  this.pieces = [];
  this.tiles = [];
};

InterfaceManager.onMove = function(options) {
  var canvas = this;

  if(_.pluck(canvas.interfaceManager.pieces, 'gui')
    .indexOf(options.target) !== -1) {
    options.target.setCoords();
    canvas.interfaceManager.tiles.forEach(function(tile) {
      var hasIntersection = tile.gui.containsPoint(
        options.target.getCenterPoint());

      if(hasIntersection) {
        tile.fadeOut();
      } else {
        tile.undoFadeOut();
      }
    });
  }
};

InterfaceManager.prototype.registerBoard = function(board) {
  this.board = board;
};

InterfaceManager.prototype.registerPiece = function(piece) {
  this.pieces.push(piece);
};

InterfaceManager.prototype.registerTile = function(tile) {
  this.tiles.push(tile);
};

module.exports = InterfaceManager;
