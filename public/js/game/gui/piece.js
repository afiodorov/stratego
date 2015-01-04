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
    'mouse:up': function() {console.log('hi'); self.onStopMove.call(this.holder);}
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
  this.canvas.interfaceManager.tiles.forEach(function(tile) {
    var hasIntersection = tile.fabricObj.containsPoint(
      self.fabricObj.getCenterPoint());

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
    var fabricObj = self.fabricObj;
    fabricObj.animate('top', fabricObj.originalState.top);
    fabricObj.animate('left', fabricObj.originalState.left);
  }

};

/**
 */
module.exports = Piece;
