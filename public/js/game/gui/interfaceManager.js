'use strict';
/*jslint node: true*/

var _ = require('lodash');

/**
 * @constructor
 * @param {fabric.Canvas} canvas
 */
var InterfaceManager = function(canvas) {
  this.BOARD_WIDTH = 600;
  this.BOARD_HEIGHT = 600;
  this.PIECE_WIDTH = 140;
  this.PIECE_HEIGHT = 73;

  this.canvas = canvas;
  this.pieces = {};
  this.tiles = [];
};

/**
 * @this {fabric.Canvas}
 * @param {object.target} options object
 */
InterfaceManager.onMove = function(options) {
  var canvas = this;
  var self = canvas.interfaceManager;

  /* moving a piece */
  if (_.pluck(canvas.interfaceManager.pieces, 'gui')
    .indexOf(options.target) !== -1) {
    self.onPieceMove(options.target);
  }
};

/**
 * @param {gui.Board} board
 */
InterfaceManager.prototype.registerBoard = function(board) {
  this.board = board;
};

/**
 * @param {gui.Piece} piece
 */
InterfaceManager.prototype.registerPiece = function(piece) {
  this.pieces[piece.name] = piece;
};

/**
 * @param {gui.Tile} tile
 */
InterfaceManager.prototype.registerTile = function(tile) {
  this.tiles.push(tile);
};

/**
 */
module.exports = InterfaceManager;
