'use strict';

var fabric = require('fabric').fabric;
var _ = require('lodash');

var Tile = function(tileStruct, width, height, top, left) {
  var textEl = new fabric.Text(tileStruct.name, {
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

  var tile = _.clone(tileStruct);

  tile.gui = new fabric.Group([rect, textEl], {
    top: top,
    left: left
  });

  return tile;
};

module.exports = Tile;
