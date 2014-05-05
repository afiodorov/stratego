/// <reference path="tileLayer.js" />
var Kinetic = require('../../../vendor/kinetic-v5.0.1.min.js');

var BOARD_WIDTH = 600;
var BOARD_HEIGHT = 600;

// Animation.....................................................
function draw(container) {
  var stage = new Kinetic.Stage({ container: container, width: BOARD_WIDTH, height: BOARD_HEIGHT });
  var tileLayer = require('./tileLayer.js')(BOARD_WIDTH, BOARD_HEIGHT)    
  stage.add(tileLayer);
}

window.draw = draw;
module.exports = draw;
