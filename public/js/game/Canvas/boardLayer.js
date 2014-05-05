/// <reference path="../structs/board.js" />
/// <reference path="../structs/side.js" />
/// <reference path="tileGroup.js" />

var side = require('../structs/side.js');

var getTileGroup = require('./tileGroup.js');

var tileLayer = function (boardWidth, boardHeight) {

  var Kinetic = require('../../../vendor/kinetic-v5.0.1.min.js');
  var tileGroups = [];

  var board = require("../gui/board.js").makeBoard({
    turn: side.DARK,
    //stage: stage.start | stage.move | stage.battle | stage.finish,
    friendlyPieces: [{ name: "saruman", position: { row: 2, col: 1 } }],
    enemyPieces: [{ position: { row: 5, col: 1 } }, { position: { row: 6, col: 0 } }, { position: { row: 6, col: 0 } }, { position: { row: 6, col: 0 } }]
  });

  //The game will be played top to bottom. "rows" are horizontal, and columns are verticle.
  for (var row = 0; row < board.tiles.length ; row++) {
    for (var col = 0; col < board.tiles[row].length ; col++) {
      width = boardWidth / board.tiles[row].length;
      height = boardHeight / board.tiles.length;
      var rect = {
        width: width,
        height: height,
        x : width * col,
        y : height * row
      }
      //for debugging most likely
      var pos = {
        row: row,
        col: col
      }
      tileGroups.push(getTileGroup(board.tiles[row][col], board.getPiecesInTile(board.tiles[row][col]), rect, pos));
    }
  }
  var layer = new Kinetic.Layer();
  tileGroups.forEach(function (a) { layer.add(a); });
  return layer;
}

module.exports = tileLayer;
