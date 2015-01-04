'use strict';
/*jslint node: true*/
/*global window*/
var fabric = require('fabric').fabric;
var Board = require('../gui/board.js');
var Piece = require('../gui/piece.js');
var Pile = require('../gui/pile.js');
var pieces = require('../structs/pieces.js');
var InterfaceManager = require('../gui/interfaceManager.js');
var _ = require('lodash');

function draw(container) {
  var canvas = new fabric.Canvas(container);
  var interfaceManager = new InterfaceManager(canvas);
  canvas.interfaceManager = interfaceManager;

  var board = new Board(canvas, interfaceManager.BOARD_WIDTH,
    interfaceManager.BOARD_HEIGHT);

  _.pluck(_.flatten(board.tiles), 'fabricObj').forEach(function(tile) {
    canvas.add(tile);
  });

  var i = 0;
  var piece;
  var lightPieces = _.values(pieces).filter(function(piece) {
    return piece.side === '__light__';});
  var darkPieces = _.values(pieces).filter(function(piece) {
    return piece.side === '__dark__';});

  var PIECE_HEIGHT = interfaceManager.PIECE_HEIGHT;
  var PIECE_WIDTH = interfaceManager.PIECE_WIDTH;

  var pile = new Pile(canvas,
    [
      new Piece(canvas, lightPieces[0], PIECE_WIDTH, PIECE_HEIGHT),
      new Piece(canvas, lightPieces[1], PIECE_WIDTH, PIECE_HEIGHT)
    ],
    {
      topOfset: 25,
      leftOfset: 32,
      left: interfaceManager.BOARD_WIDTH + 5
    });

  pile.getObjects().forEach(function(object) {
    canvas.add(object);
  });

  for (i = 2; i < lightPieces.length; i++) {
    piece = new Piece(canvas, lightPieces[i], PIECE_WIDTH, PIECE_HEIGHT);
    piece.fabricObj.setTop((PIECE_HEIGHT + 2) * i);
    piece.fabricObj.setLeft(interfaceManager.BOARD_WIDTH + 5);
    canvas.add(piece.fabricObj);
  }

  for (i = 0; i < darkPieces.length; i++) {
    piece = new Piece(canvas, darkPieces[i], PIECE_WIDTH, PIECE_HEIGHT,
      (PIECE_HEIGHT + 2) * i, interfaceManager.BOARD_WIDTH + PIECE_WIDTH + 45);
    canvas.add(piece.fabricObj);
  }

  canvas.renderAll();
}

/**
 */
window.draw = draw;
//draw();
//module.exports = draw;
