'use strict';

var fabric = require('fabric').fabric;
var _ = require('lodash');

var Tile = function(canvas, tileStruct, width, height, top, left) {
  var textEl = new fabric.Text(tileStruct.name, {
    originX: 'center',
    originY: 'center',
    fontSize: 17,
    fill: 'white',
    fontFamily: 'Ubuntu'
  });

  var rect = new fabric.Rect({
    originX: 'center',
    originY: 'center',
    width: width,
    height: height,
    stroke: 'white',
    strokeWidth: 2,
    selectable: false
  });

  var tile = this;
  _.assign(tile, tileStruct);

  tile.gui = new fabric.Group([rect, textEl], {
    top: top,
    left: left,
  });

  tile.canvas = canvas;
  canvas.interfaceManager.registerTile(tile);

  return tile;
};

Tile.prototype.fadeOut = function() {
  this.gui.item(0).animate('opacity', 0.7, {
    onChange: this.canvas.renderAll.bind(this.canvas),
    duration: 2000
  });
};

Tile.prototype.highlightSpaces = function() {
  this.fadeOut();
};

module.exports = Tile;
