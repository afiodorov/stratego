'use strict';
/*jslint node: true*/
var fabric = require('fabric').fabric;
var Board = require('./gui/board.js');
var Piece = require('./gui/piece.js');
var Pile = require('./gui/pile.js');
var pieces = require('./structs/pieces.js');
var _ = require('lodash');

var GameManager = function() {
  this.dimensions = require('./gui/dimenstion.js');
  return this;
};

/**
 * @param {string} canvasId
 */
GameManager.prototype.setCanvasId = function(canvasId) {
  this.canvasId = canvasId;
};

/**
 * @param {Progress} progress
 */
GameManager.prototype.registerRules = function(progress) {
  var Rules = require('./rules.js');
  this.rules = new Rules(progress);
};

/**
 * @param {Progress} progress
 */
GameManager.prototype.setProgress = function(progress) {
  this.progress = progress;
};

/**
 *
 */
GameManager.prototype.initaliseGui = function() {
  var canvas = new fabric.Canvas(this.canvasId);
  canvas.gameManager = this;

  var dims = this.dimensions;
  this.board = new Board(canvas, dims.BOARD_WIDTH, dims.BOARD_HEIGHT);

  _.pluck(_.flatten(this.board.tiles), 'fabricObj').forEach(function(tile) {
    canvas.add(tile);
  });

  var i = 0;
  var piece;
  var lightPieces = _.values(pieces).filter(function(piece) {
    return piece.side === '__light__';});
  var darkPieces = _.values(pieces).filter(function(piece) {
    return piece.side === '__dark__';});


  var pile = new Pile(canvas,
    [
      new Piece(canvas, lightPieces[0], dims.PIECE_WIDTH, dims.PIECE_HEIGHT),
      new Piece(canvas, lightPieces[1], dims.PIECE_WIDTH, dims.PIECE_HEIGHT)
    ],
    {
      topOfset: 25,
      leftOfset: 32,
      left: dims.BOARD_WIDTH + 5
    });

  pile.getObjects().forEach(function(object) {
    canvas.add(object);
  });

  for (i = 2; i < lightPieces.length; i++) {
    piece = new Piece(canvas, lightPieces[i],
      dims.PIECE_WIDTH, dims.PIECE_HEIGHT);

    piece.fabricObj.setTop((dims.PIECE_HEIGHT + 2) * i);
    piece.fabricObj.setLeft(dims.BOARD_WIDTH + 5);
    canvas.add(piece.fabricObj);
  }

  for (i = 0; i < darkPieces.length; i++) {
    piece = new Piece(canvas, darkPieces[i], dims.PIECE_WIDTH,
      dims.PIECE_HEIGHT, (dims.PIECE_HEIGHT + 2) * i,
      dims.BOARD_WIDTH + dims.PIECE_WIDTH + 45);
    canvas.add(piece.fabricObj);
  }

  canvas.renderAll();
};

/**
 */
module.exports = GameManager;
