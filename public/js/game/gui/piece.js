'use strict';
/*jslint node: true*/

var fabric = require('fabric').fabric;
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
  self.fabricObj = new fabric.Group([rect, name, strength, desc],
    {
      top: top,
      left: left,
      hasControls: false
    });
  self.fabricObj.holder = self;
  _.assign(self, pieceStruct);

  self.fabricObj.on(
  {
    'moving': function() {self.onMove.call(this.holder);},
    'mouseup': function() {self.onStopMove.call(this.holder);},
    'mousedown': function() {self.onStartMove.call(this.holder);}
  });
  self.fabricObj.setupState();
};

Piece.prototype.onMove = function() {

  var self = this;
  var rules = self.canvas.gameManager.rules;
  self.fabricObj.setCoords();

  self.setCandidateTile(null);
  var boundingRect = self.fabricObj.getBoundingRect();
  var leftCorner = new fabric.Point(boundingRect.left, boundingRect.top);
  _.flatten(this.canvas.gameManager.board.tiles).forEach(function(tile) {
    var hasIntersection = tile.fabricObj.containsPoint(leftCorner);

    if (hasIntersection &&
      (rules.getAvailTiles(self).indexOf(tile.name) !== -1) &&
      !tile.isFull()) {
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

  var candidateTile  = self.getCandidateTile();
  if (candidateTile) {
    candidateTile.fadeIn();
    self.canvas.renderAll();

    var allTiles = self.canvas.gameManager.board.tiles;
    var otherTiles = _.without(_.flatten(allTiles), candidateTile);
    _.invoke(otherTiles, 'remove', self);
    candidateTile.add(self);
    self.setCandidateTile(null);
  } else {
    // nowhere to add this piece
    self.animatedReturn();
  }

};

/**
 */
Piece.prototype.onStartMove = function() {

  var self = this;
  var progress = self.canvas.gameManager.progress;

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
