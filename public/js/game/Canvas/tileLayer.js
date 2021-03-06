﻿/// <reference path="../structs/board.js" />
/// <reference path="../structs/side.js" />

var side = require('../structs/side.js');

var tileLayer = function (boardWidth, boardHeight) {
  var MAXPIECESINROW = 6;
  var MAXPIECESINCOL = 7;

  var Kinetic = require('../../../vendor/kinetic-v5.0.1.min.js');
  var boardMod = require("../gui/board.js");
  var tileGroups = [];

  var board = boardMod.makeBoard({
    turn: side.DARK,
    //stage: stage.start | stage.move | stage.battle | stage.finish,
    friendlyPieces: [{ name: "saruman", position: { row: 2, col: 1 } }],
    enemyPieces: [{ position: { row: 5, col: 1 } }, { position: { row: 6, col: 0 } }, { position: { row: 6, col: 0 } }, { position: { row: 6, col: 0 } }]
  });

  function getTileGroup(tile, rectWidth, rectHeight, rectX, rectY) {
    var group = new Kinetic.Group({
      width: rectWidth,
      height: rectHeight,
      x: rectX,
      y: rectY
    });
    group.add(new Kinetic.Rect({
      width: rectWidth,
      height: rectHeight,
      fill: 'green',
      stroke: 'black',
      strokeWidth: 4
    }));
    group.add(new Kinetic.Text({
      width: rectWidth,
      height: rectHeight,
      text: tile.name + " " + row + " " + col,
      fontSize: 18,
      fontFamily: 'Calibri',
      fill: '#555',
      padding: 20,
      align: 'center'
    }));

    for (var i = 0; i < tile.getPieces().length; i++) {
      var pieceGroup = getPieceGroup(tile.getPieces()[i], i * rectWidth / tile.getPieces().length);
      group.add(pieceGroup);
    }
    return group;
  }

  function getPieceGroup(piece, xOffset) {
    var radius = Math.min(boardWidth / (MAXPIECESINROW * 2), boardHeight / (MAXPIECESINCOL * 2));
    var group = new Kinetic.Group({
      x: xOffset,
      width: radius * 2,
      height: radius * 2,
    });
    group.add(new Kinetic.Circle({
      radius: radius,
      x: radius,
      y: radius,
      fill: 'red',
      stroke: 'black',
      strokeWidth: 4
    }));
    group.add(new Kinetic.Text({
      width: radius * 2,
      height: radius * 2,
      text: piece.name,
      fontSize: 18,
      fontFamily: 'Calibri',
      fill: '#555',
      padding: 20,
      align: 'center'
    }));
    return group;
  }

  //The game will be played top to bottom. "rows" are horizontal, and columns are verticle.
  for (var row = 0; row < board.tiles.length ; row++) {
    for (var col = 0; col < board.tiles[row].length ; col++) {
      var rectWidth = boardWidth / board.tiles[row].length;
      var rectHeight = boardHeight / board.tiles.length;
      var rectX = rectWidth * col;
      var rectY = rectHeight * row;
      tileGroups.push(getTileGroup(board.tiles[row][col], rectWidth, rectHeight, rectX, rectY));
    }
  }
  var layer = new Kinetic.Layer();
  tileGroups.forEach(function (a) { layer.add(a); });
  return layer;
}

module.exports = tileLayer;
