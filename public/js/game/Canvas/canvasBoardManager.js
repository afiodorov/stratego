/*global window*/
var fabric = require('fabric').fabric;

var BOARD_WIDTH = 600;
var BOARD_HEIGHT = 600;

function draw(container) {
  var canvas = new fabric.Canvas(container);
  var rect = new fabric.Rect({
    left: 100,
    top: 100,
    fill: 'red',
    width: 20,
    height: 20,
    angle: 45
  });

  canvas.add(rect);
}

window.draw = draw;
//draw();
//module.exports = draw;
