/*global document*/
'use strict';
/*jslint node: true*/
var fabric = require('fabric').fabric;
var Board = require('./gui/board.js');
var Piece = require('./gui/piece.js');
var Pile = require('./gui/pile.js');
var pieces = require('./structs/pieces.js');
var Button = require('./gui/button.js');
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
  var self = this;

  var canvas = new fabric.Canvas(this.canvasId);
  canvas.hoverCursor = 'pointer';
  canvas.gameManager = this;

  var dims = this.dimensions;
  this.board = new Board(canvas, {
    top: dims.BOARD_TOP,
    left: dims.BOARD_LEFT,
    height: dims.BOARD_HEIGHT,
    width: dims.BOARD_WIDTH
  });

  _.pluck(_.flatten(this.board.tiles), 'fabricObj').forEach(function(tile) {
    canvas.add(tile);
  });

  /* temporary pieces initialisation directly on canvas */
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
      left: dims.BOARD_WIDTH + dims.BOARD_LEFT + 5
    });

  this.piles = [];
  this.piles.push(pile);

  canvas.add.apply(canvas, pile.getObjects());

  this.pieces = [];
  for (i = 2; i < lightPieces.length; i++) {
    piece = new Piece(canvas, lightPieces[i],
      dims.PIECE_WIDTH, dims.PIECE_HEIGHT);

    piece.fabricObj.setTop((dims.PIECE_HEIGHT + 2) * i);
    piece.fabricObj.setLeft(dims.BOARD_WIDTH + dims.BOARD_LEFT + 5);
    this.pieces.push(piece);
  }

  for (i = 0; i < darkPieces.length; i++) {
    piece = new Piece(canvas, darkPieces[i], dims.PIECE_WIDTH,
      dims.PIECE_HEIGHT, (dims.PIECE_HEIGHT + 2) * i,
      dims.BOARD_WIDTH + dims.PIECE_WIDTH + dims.BOARD_LEFT + 30);
      this.pieces.push(piece);
  }

  canvas.add.apply(canvas, _.pluck(this.pieces, 'fabricObj'));

  var submitButton = new Button(document.getElementById('green-button'),
  {
    top: dims.SUBMIT_BUTTON_TOP,
    left: dims.SUBMIT_BUTTON_LEFT
  });

  var restoreButton = new Button(document.getElementById('red-button'),
  {
    top: dims.RESTORE_BUTTON_TOP,
    left: dims.RESTORE_BUTTON_LEFT
  });
  restoreButton.fabricObj.on(
  {
    'mouseup': function() {self.onRestore();}
  });

  this.buttons = {
    'submit': submitButton,
    'restore': restoreButton
  };

  canvas.add.apply(canvas, _.pluck(_.values(this.buttons), 'fabricObj'));

  canvas.renderAll();
};

/**
 */
GameManager.prototype.onRestore = function() {
  this.progress.clearPendingActions();
};

/**
 * @param {object} change
 */
GameManager.prototype.onPendingActionChange = function(change) {
  console.log(change);
};

/**
 */
module.exports = GameManager;
