'use strict';

var fabric = require('fabric').fabric;

var Tile = function(text, width, height, top, left) {
  var textEl = new fabric.Text(text, {
    fontSize: 30,
    originX: 'center',
    originY: 'center',
    fill: 'white'
  });

  var rect = new fabric.Rect({
    width: width,
    height: height
  });

  return new fabric.Group([textEl, rect], {
    top: top,
    left: left
  });
};

module.exports = Tile;
