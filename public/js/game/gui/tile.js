'use strict';

var fabric = require('fabric').fabric;

var Tile = function(text, width, height, top, left) {
  var textEl = new fabric.Text(text, {
    originX: 'center',
    originY: 'center',
    fontSize: 15,
    fill: 'red'
  });

  var rect = new fabric.Rect({
    originX: 'center',
    originY: 'center',
    width: width - 1,
    height: height - 1
  });

  return new fabric.Group([rect, textEl], {
    top: top,
    left: left
  });
};

module.exports = Tile;
