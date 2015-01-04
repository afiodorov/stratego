'use strict';
/*jslint node: true*/

var LinkedObjects = require('./fabric/linkedObjects.js');
var _ = require('lodash');
var fabric = require('fabric').fabric;

/**
 * @constructor
 * @param {fabric.Canvas} canvas reference
 * @param {array.<gui.Piece>} pieces Initial elements in the pile
 * @param {struct} parameters
 */
var Pile = function(canvas, pieces, parameters) {
  var self = this;

  var defaults = _.partialRight(_.assign, function(a, b) {
    return (a === undefined) ? b : a;
  });

  var defaultValues = {
    topOfset: 0,
    leftOfset: 0,
    left: 0,
    top: 0,
    capacity: 0
  };

  _.assign(this, defaults(_.clone(parameters), defaultValues));
  this.pieces = pieces;

  _.pluck(this.pieces, 'gui').forEach(function(fabricObject) {
    fabricObject.setTop(self.top);
    fabricObject.setLeft(self.left);
  });

  _.range(0, pieces.length).forEach(function(elNum) {
    var fabricObject = pieces[elNum].gui;
    fabricObject.setTop(fabricObject.getTop() + self.topOfset * elNum);
    fabricObject.setLeft(fabricObject.getLeft() + self.leftOfset * elNum);
  });

  this.canvas = canvas;
};

/**
 * @param {object} element Adds an element to the pile
 */
Pile.prototype.add = function(element) {
  console.log(element);
};

/**
 * @param {gui.Piece} piece Removes an element from the pile
 * @return {gui.Piece} removed element
 */
Pile.prototype.remove = function(piece) {
  var self = this;
  var pieceIndex = this.pieces.indexOf(piece);

  if (pieceIndex === -1) {
    throw new Error('out of bounds');
  }

  this.pieces.splice(pieceIndex, 1);

  _.range(pieceIndex, this.pieces.length).forEach(
    function(i) {
      self.pieces[i].gui.animate('top', '-=' + self.topOfset.toString(), {
        onChange: self.canvas.renderAll.bind(self.canvas)
      });
      self.pieces[i].gui.animate('left', '-=' + self.leftOfset.toString(), {
        onChange: self.canvas.renderAll.bind(self.canvas)
      });
    });

  return piece;
};

/**
 * @return {array<fabric.Object>}
 */
Pile.prototype.getObjects = function() {
  return _.pluck(this.pieces, 'gui');
};

/**
 */
module.exports = Pile;
