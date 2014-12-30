/*global window*/
var fabric = require('fabric').fabric;
var Board = require('../gui/board.js');

function draw(container) {
  var BOARD_WIDTH = 600;
  var BOARD_HEIGHT = 600;

  var canvas = new fabric.Canvas(container);
  var board = new Board(BOARD_WIDTH, BOARD_HEIGHT);

  canvas.add(board.gui);
}

window.draw = draw;
//draw();
//module.exports = draw;
