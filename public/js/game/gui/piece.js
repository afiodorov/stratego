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
  self.fabricObj.on({'moving': function() {self.onMove.call(this.holder);}});
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

  this.canvas.interfaceManager.tiles.forEach(function(tile) {
    var hasIntersection = tile.fabricObj.containsPoint(
      self.fabricObj.getCenterPoint());

    if (hasIntersection) {
      tile.fadeOut();
    } else {
      tile.fadeIn();
    }
  });
};

/**
 */
module.exports = Piece;
