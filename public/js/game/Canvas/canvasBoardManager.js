/*global window*/
var fabric = require('fabric').fabric;
var Board = require('../gui/board.js');
var Piece = require('../gui/piece.js');
var pieces = require('../structs/pieces.js');
var _ = require('lodash');

function draw(container) {
  var BOARD_WIDTH = 600;
  var BOARD_HEIGHT = 600;
  var PIECE_WIDTH = BOARD_WIDTH / 4 - 10;
  var PIECE_HEIGHT = BOARD_HEIGHT / 7 - 12;

  var canvas = new fabric.Canvas(container);
  var board = new Board(canvas, BOARD_WIDTH, BOARD_HEIGHT);

  canvas.add(board.gui);

  board.tiles[0][0].fadeOut();

  var i = 0;
  var piece;
  var lightPieces = _.values(pieces).filter(function(piece) {
    return piece.side === '__light__';});
  var darkPieces = _.values(pieces).filter(function(piece) {
    return piece.side === '__dark__';});

  for(i = 0; i<lightPieces.length; i++) {
    piece = new Piece(canvas, lightPieces[i], PIECE_WIDTH, PIECE_HEIGHT,
      (PIECE_HEIGHT+2) * i, BOARD_WIDTH + 5);
    canvas.add(piece.gui);
  }

  for(i = 0; i<darkPieces.length; i++) {
    piece = new Piece(canvas, darkPieces[i], PIECE_WIDTH, PIECE_HEIGHT,
      (PIECE_HEIGHT+2) * i, BOARD_WIDTH + PIECE_WIDTH + 10);
    canvas.add(piece.gui);
  }
}

window.draw = draw;
//draw();
//module.exports = draw;
