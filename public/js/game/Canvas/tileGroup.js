/// <reference path="pieceGroup.js" />

var getPieceGroup = require('./pieceGroup.js');
var Kinetic = require('../../../vendor/kinetic-v5.0.1.min.js');

function getTileGroup(tile, containedPieces, rect, pos) {
  var group = new Kinetic.Group({
    width: rect.width,
    height: rect.height,
    x: rect.x,
    y: rect.y
  });
  group.add(new Kinetic.Rect({
    width: rect.width,
    height: rect.height,
    fill: 'green',
    stroke: 'black',
    strokeWidth: 4
  }));
  group.add(new Kinetic.Text({
    width: rect.width,
    height: rect.height,
    text: tile.name + "\nrow: " + pos.row + " col: " + pos.col,
    fontSize: 18,
    fontFamily: 'Calibri',
    fill: '#555',
    padding: 20,
    align: 'center'
  }));

  for (var i = 0; i < containedPieces.length; i++) {
    var pieceGroup = getPieceGroup(containedPieces[i], i * rect.width / containedPieces.length);
    group.add(pieceGroup);
  }
  return group;
}

module.exports = getTileGroup;