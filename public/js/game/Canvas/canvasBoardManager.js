/*global window*/
var fabric = require('fabric').fabric;
var Board = require('../gui/board.js');

function draw(container) {
  var canvas = new fabric.Canvas(container);
  var board = new Board();

  canvas.add(board);
}

window.draw = draw;
//draw();
//module.exports = draw;
