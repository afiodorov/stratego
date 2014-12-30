'use strict';

var fabric = require('fabric').fabric;
var _ = require('lodash');

var Piece = function(pieceStruct, pieceWidth, pieceHeight, top, left) {

  var piece = _.clone(pieceStruct);

  var name = new fabric.Text(pieceStruct.name, {
    fontSize: 20,
    top: 1,
    left: 20
  });

  var strength = new fabric.Text(pieceStruct.strength.toString(), {
    fontSize: 40,
    top: pieceHeight - 50,
    left: 5
  });

  var desc = new fabric.Text(pieceStruct.description, {
    fontSize: 13,
    top: 25,
    left: 45,
    textAlign: 'right'
  });

  var rect = new fabric.Rect({
    width: pieceWidth,
    height: pieceHeight,
    fill: 'green'
  });

  piece.gui = new fabric.Group([rect, name, strength, desc], {
    top: top,
    left: left
  });

  return piece;

};

module.exports = Piece;
