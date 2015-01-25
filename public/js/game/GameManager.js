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

/**
 */
_.negate = require('../lib/negate.js');

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
GameManager.prototype.initialiseGui = function() {
  var self = this;

  var canvas = new fabric.Canvas(this.canvasId);

  canvas.hoverCursor = 'pointer';
  canvas.gameManager = this;
  this.canvas = canvas;

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
  var lightPieces = _.values(pieces).filter(function(piece) {
    return piece.side === '__light__';});
  var darkPieces = _.values(pieces).filter(function(piece) {
    return piece.side === '__dark__';});


  var piece1, piece2;
  var pile;
  this.pieces = [];
  for (i = 0; i < lightPieces.length; i += 2) {
    piece1 = new Piece(canvas, lightPieces[i],
      dims.PIECE_WIDTH, dims.PIECE_HEIGHT);
    piece2 = ((i + 1) < lightPieces.length) ?
      new Piece(canvas, lightPieces[i + 1],
      dims.PIECE_WIDTH, dims.PIECE_HEIGHT) : null;

    this.pieces.push(piece1);
    if (piece2) {
      this.pieces.push(piece2);
    }

    pile = new Pile(canvas, [piece1, piece2].filter(_.negate(_.isNull)),
      {
        topOfset: 25,
        leftOfset: 32,
        left: dims.BOARD_WIDTH + dims.BOARD_LEFT + 5,
        top: (dims.PIECE_HEIGHT + 40) * Math.floor(i / 2)
      });
  }

  for (i = 0; i < darkPieces.length; i += 2) {
    piece1 = new Piece(canvas, darkPieces[i],
      dims.PIECE_WIDTH, dims.PIECE_HEIGHT);
    piece2 = ((i + 1) < darkPieces.length) ?
      new Piece(canvas, darkPieces[i + 1],
      dims.PIECE_WIDTH, dims.PIECE_HEIGHT) : null;

    this.pieces.push(piece1);
    if (piece2) {
      this.pieces.push(piece2);
    }

    pile = new Pile(canvas, [piece1, piece2].filter(_.negate(_.isNull)),
      {
        topOfset: 25,
        leftOfset: 32,
        left: dims.BOARD_WIDTH + dims.PIECE_WIDTH + dims.BOARD_LEFT + 50,
        top: (dims.PIECE_HEIGHT + 40) * Math.floor(i / 2)
      });
  }

  canvas.add.apply(canvas, _.pluck(this.pieces, 'fabricObj'));

  var submitButton = new Button(canvas,
    document.getElementById('green-button'),
    {
      top: dims.SUBMIT_BUTTON_TOP,
      left: dims.SUBMIT_BUTTON_LEFT,
      opacity: 0
    });

  var restoreButton = new Button(canvas,
    document.getElementById('red-button'),
    {
      top: dims.RESTORE_BUTTON_TOP,
      left: dims.RESTORE_BUTTON_LEFT,
      opacity: 0
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
GameManager.prototype.onPendingActionChange = function() {

  if (this.progress.pendingActions.length === 0) {
    console.log('here');
    this.buttons.restore.hide();
  } else {
    this.buttons.restore.show();
  }

  if (this.rules.isReadyToSubmit(this.board.getState())) {
    this.buttons.submit.show();
  } else {
    this.buttons.submit.hide();
  }
};

/**
 */
module.exports = GameManager;
