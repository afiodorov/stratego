/*global window*/
var Kinetic = require('kinetic');

var BOARD_WIDTH = 600;
var BOARD_HEIGHT = 600;

// Animation.....................................................
function draw(container) {
  var stage = new Kinetic.Stage({ container: container, width: BOARD_WIDTH,
    height: BOARD_HEIGHT });
  var tileLayer = require('./tileLayer.js')(BOARD_WIDTH, BOARD_HEIGHT);

  var layer = new Kinetic.Layer();

  var circle = new Kinetic.Circle({
    x: stage.getWidth() / 2,
    y: stage.getHeight() / 2,
    radius: 70,
    fill: 'red',
    stroke: 'black',
    strokeWidth: 4
  });

  // add the shape to the layer
  layer.add(circle);

  //stage.add(layer);
  stage.add(tileLayer);
  //tileLayer.setZIndex(3);
}

//window.draw = draw;
//draw();
//module.exports = draw;
