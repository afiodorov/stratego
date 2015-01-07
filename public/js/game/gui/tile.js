/*global module*/
'use strict';

var fabric = require('fabric').fabric;
var FabricMixin = require('./../../util/FabricMixin.js');
var _ = require('lodash');

var Tile = function(canvas, tileStruct, width, height, top, left) {
  var self = this;
  self.canvas = canvas;
  _.assign(self, tileStruct);
  self.capacity = canvas.gameManager.rules.getTileCapacity(self);
  self.pieces = [];

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


  var spaceBetweenPieces = 5;
  var dims = canvas.gameManager.dimensions;
  var spaceTotalWidth = dims.PIECE_WIDTH + spaceBetweenPieces;
  var capacityMiddle = Math.floor(self.capacity / 2);
  var pieceSpaces =  _.range(-capacityMiddle,
    -capacityMiddle + self.capacity).map(function(centeredPieceSpaceNum) {

    return new fabric.Rect({
      originY: 'center',
      /*TODO: remove if*/
      originX: (self.capacity === 1 ? 'center' : 'left'),
      width: dims.PIECE_WIDTH,
      height: dims.PIECE_HEIGHT,
      left: centeredPieceSpaceNum * spaceTotalWidth,
      selectable: false,
      fill: 'none',
      strokeWidth: 2,
      stroke: 'grey',
      strokeDashArray: [5,5]
    });
  });

  self.linkFabric(
    new fabric.Group([outerRect].concat(pieceSpaces).concat([textEl]),
    {
      top: top,
      left: left,
      selectable: false
    })
  );
};

Tile.prototype = new FabricMixin();
/**
 */
Tile.prototype.constructor = Tile;

Tile.prototype.fadeOut = function() {
  if(this.isFaded) {
    return;
  }
  this.isFaded = true;
  this.fabricObj.item(0).setOpacity(0.7);
};

Tile.prototype.fadeIn = function() {
  if(!this.isFaded) {
    return;
  }
  this.isFaded = false;
  this.fabricObj.item(0).setOpacity(1);
};

/**
 */
Tile.prototype.isFull = function() {
  return this.capacity === this.pieces.length;
};

Tile.prototype.highlightSpaces = function() {
  this.fadeOut();
};

/**
 */
Tile.prototype.remove = function(piece) {
  var index = this.pieces.indexOf(piece);

  if (index > -1) {
    this.pieces.splice(piece, 1);
  }
};

/**
 */
Tile.prototype.add = function(piece) {
  var index = this.pieces.indexOf(piece);

  if (index === -1) {
    this.pieces.push(piece);
  }
};

module.exports = Tile;
