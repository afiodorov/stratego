'use strict';
/*jslint node: true*/

var fabric = require('fabric').fabric;
var FabricMixin = require('./../../util/FabricMixin.js');
var _ = require('lodash');

var Piece = function(canvas, pieceStruct, pieceWidth, pieceHeight, top, left) {

  var name = new fabric.Text(pieceStruct.name, {
    fontSize: 19,
    top: 0,
    left: 4,
    fontFamily: 'Ubuntu'
  });

  var strength = new fabric.Text(pieceStruct.strength.toString(), {
    fontSize: 40,
    top: pieceHeight - 50,
    left: 3
  });

  var desc = new fabric.Text(pieceStruct.description, {
    fontSize: 13,
    top: 31,
    left: 32,
    textAlign: 'right',
    lineHeight: 1,
    fontFamily: 'Ubuntu'
  });

  var rect = new fabric.Rect({
    width: pieceWidth,
    height: pieceHeight,
    fill: 'green',
    strokeWidth: 2,
    stroke: '#3B5323'
  });

  var self = this;
  self.canvas = canvas;
  self.linkFabric(new fabric.Group([rect, name, strength, desc],
    {
      top: top,
      left: left,
      hasControls: false
    })
  );
  _.assign(self, pieceStruct);
  self.fabricObj.on(
  {
    'moving': function() {self.onMove.call(this.holder);},
    'mouseup': function() {self.onStopMove.call(this.holder);},
    'mousedown': function() {self.onStartMove.call(this.holder);}
  });
  self.fabricObj.setupState();
  canvas.interfaceManager.registerPiece(self);
};

Piece.prototype = new FabricMixin();
/**
 */
Piece.prototype.constructor = Piece;
/**
 */
Piece.prototype.onMove = function() {

  var self = this;
  self.fabricObj.setCoords();

  self.setCandidateTile(null);
  var boundingRect = self.fabricObj.getBoundingRect();
  var leftCorner = new fabric.Point(boundingRect.left, boundingRect.top);
  this.canvas.interfaceManager.tiles.forEach(function(tile) {
    var hasIntersection = tile.fabricObj.containsPoint(leftCorner);

    if (hasIntersection) {
      self.setCandidateTile(tile);
      tile.fadeOut();
    } else {
      tile.fadeIn();
    }
  });
};


/**
 * @param {gui.Tile} tile Sets a tile the Piece has been hovered over
 */
Piece.prototype.setCandidateTile = function(tile) {
  this.candidateTile = tile;
};

/**
 * @return {gui.Tile}
 */
Piece.prototype.getCandidateTile = function() {
  return this.candidateTile;
};

/**
 */
Piece.prototype.onStopMove = function() {

  var self = this;

  if (self.getCandidateTile()) {
    self.getCandidateTile().add(self);
  } else {
    // nowhere to add this piece
    self.animatedReturn();
  }

};

/**
 */
Piece.prototype.onStartMove = function() {

  var self = this;
  /**TODO**/
};

/**
 */
Piece.prototype.animatedReturn = function() {
  var self = this;
  var fabricObj = self.fabricObj;
  var onChangeO = {onChange: self.canvas.renderAll.bind(self.canvas)};
  fabricObj.animate('top', fabricObj.originalState.top, onChangeO);
  fabricObj.animate('left', fabricObj.originalState.left, onChangeO);
};

/**
 */
module.exports = Piece;
