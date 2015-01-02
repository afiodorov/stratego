/*global module*/
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

  var outerRect = new fabric.Rect({
    originX: 'center',
    originY: 'center',
    width: width,
    height: height,
    stroke: 'white',
    strokeWidth: 2,
    selectable: false
  });


  var im = canvas.interfaceManager;
  var spaceBetweenPieces = 5;
  var spaceTotalWidth = im.PIECE_WIDTH + spaceBetweenPieces;
  var capacityMiddle = Math.floor(tileStruct.capacity / 2);
  var pieceSpaces =  _.range(-capacityMiddle,
    -capacityMiddle + tileStruct.capacity).map(function(centeredPieceSpaceNum) {

    return new fabric.Rect({
      originY: 'center',
      /*TODO: remove if*/
      originX: (tileStruct.capacity === 1 ? 'center' : 'left'),
      width: im.PIECE_WIDTH,
      height: im.PIECE_HEIGHT,
      left: centeredPieceSpaceNum * spaceTotalWidth,
      selectable: false,
      fill: 'none',
      strokeWidth: 2,
      stroke: 'grey',
      strokeDashArray: [5,5]
    });
  });

  /*TODO: remove it*/
  if([2,4].indexOf(tileStruct.position.row) !== -1) {
    pieceSpaces = [];
  }

  var tile = this;
  _.assign(tile, tileStruct);

  tile.gui = new fabric.Group([outerRect].concat(pieceSpaces).concat([textEl]),
  {
    top: top,
    left: left,
    selectable: false
  });

  tile.canvas = canvas;
  canvas.interfaceManager.registerTile(tile);

  return tile;
};

Tile.prototype.fadeOut = function() {
  this.isFaded = true;
  this.gui.item(0).setOpacity(0.7);
};

Tile.prototype.fadeIn = function() {
  if(!this.isFaded) {
    return;
  }
  this.gui.item(0).setOpacity(1);
  this.isFaded = false;
};

Tile.prototype.highlightSpaces = function() {
  this.fadeOut();
};

module.exports = Tile;
