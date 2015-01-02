/*global module*/
'use strict';

var _ = require('lodash');

var InterfaceManager = function(canvas) {
  this.BOARD_WIDTH = 600;
  this.BOARD_HEIGHT = 600;
  this.PIECE_WIDTH = 140;
  this.PIECE_HEIGHT = 73;

  this.canvas = canvas;
  this.pieces = [];
  this.tiles = [];
};

InterfaceManager.onMove = function(options) {
  var canvas = this;
  var self = canvas.interfaceManager;

  /* moving a piece */
  if(_.pluck(canvas.interfaceManager.pieces, 'gui')
    .indexOf(options.target) !== -1) {
    self.onPieceMove(options.target);
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

InterfaceManager.prototype.onPieceMove = function(pieceGui) {

  pieceGui.setCoords();

  this.tiles.forEach(function(tile) {
    var hasIntersection = tile.gui.containsPoint(
      pieceGui.getCenterPoint());

    if(hasIntersection) {
      tile.fadeOut();
    } else {
      tile.fadeIn();
    }
  });
};

module.exports = InterfaceManager;
