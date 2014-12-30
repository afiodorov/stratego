'use strict';

var fabric = require('fabric').fabric;
var _ = require('lodash');

var Piece = function(canvas, pieceStruct, pieceWidth, pieceHeight, top, left) {

  var piece = this;
  piece.canvas = canvas;
  canvas.interfaceManager.registerPiece(piece);

  _.assign(piece, pieceStruct);

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

  piece.gui = new fabric.Group([rect, name, strength, desc], {
    top: top,
    left: left,
    hasControls: false
  });

  return piece;

};

module.exports = Piece;
