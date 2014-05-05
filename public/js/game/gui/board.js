/// <reference path="tile.js" />
/// <reference path="../../lib/underscore.js" />
/// <reference path="side.js" />
/// <reference path="../structs/piece.js" />

var side = require('../structs/side.js');


var makeBoard = function (gameState) {
  // We are defining the tiles' position by its' location in the array.
  // All postional relatives will be assuming that the Shire is South, and that Mordor is North.
  // The shire will be at the top of the board with a 0 row index, Mordor at the bottom, with the highest row index.
  var tiles = require('./tiles.js');
  var allPieces = require('./../structs/pieces.js');
  //var friendlyPieces = gameState.friendlyPieces.map(function (p) { return allPieces[p.name]; });

  var piecePositions = [];

  function getTile(pos) {
    return tiles[pos.row][pos.col];
  }
  
  (function assignPiecePositions() {
    for (var i = 0; i < gameState.friendlyPieces.length; i++) {
      piecePositions.push({
        tile: getTile(gameState.friendlyPieces[i].position),
        piece: allPieces[gameState.friendlyPieces[i].name]
      });
    };
    var enemyPiece = require('./../structs/piece.js')('???', undefined, undefined, undefined);
    for (var i = 0; i < gameState.enemyPieces.length; i++) {
      //The only part of the enemy pieces that get used should be the name, and not the real name.
      //If anything else is called from enemy pieces found in the tile, there should be many an error.
      piecePositions.push({
        tile: getTile(gameState.enemyPieces[i].position),
        piece: enemyPiece
      });
    };
  })();

  function getPiecesInTile(tile) {
     return piecePositions.filter(function (pp) { return pp.tile === tile; }).map(function (pp) { return pp.piece; });
  }

  //var playerSide = friendlyPieces[0].side;

  //This will come from the server instead.
  //var validMoveFuncs = (function () {

  //  var getVerticleAdjTiles = function (tile, goingNorth) {
  //    var targetRow = tile.position.y + (goingNorth ? -1 : +1);
  //    if (targetRow >= tiles.length || targetRow < 0) {
  //      return [];//ensures tiles[targetRow] always exists below.
  //    }
  //    if (tiles[targetRow].length > tiles[tile.position.y].length) {
  //      return [tiles[targetRow][tile.position.x], tiles[targetRow][tile.position.x + 1]];
  //    }
  //    else {
  //      return [tiles[targetRow][tile.position.x], tiles[targetRow][tile.position.x - 1]].filter(isDefined);
  //    }
  //  }

  //  var isDefined = function (obj) {
  //    return obj !== undefined;
  //  }

  //  var isNotAtMaxCap = function (tile) {
  //    return !tile.isAtMaxCap();
  //  }

  //  var getHorizontalAdjTiles = function (tile) {
  //    return [tiles[tile.position.y][tile.position.x - 1], tiles[tile.position.y][tile.position.x + 1]].filter(isDefined);
  //  }

  //  //potential refers to it being prior to the check that the square actually has space.
  //  var getPotentialForwards = function (tile) {
  //    var forwardTiles = getVerticleAdjTiles(tile, playerSide === side.DARK);
  //    if (playerSide === side.LIGHT && tile === tiles[2][1]) {//You can take a shortcut from this square if you're on the light side. 
  //      forwardTiles.push(tiles[4][1]);
  //    }
  //    return forwardTiles;
  //  }

  //  var getPotentialBackwards = function (tile) {
  //    return getVerticleAdjTiles(tile, playerSide === side.LIGHT);
  //  }

  //  var getPotentialSideways = function (tile) {
  //    if (tile.position.y === 3) {//Mountains, maybe this should be stored in the tile itself?
  //      return [];
  //    }
  //    if (tile.position.y === 4) {//River, see above.
  //      if (playerSide === side.DARK) {
  //        return [];
  //      }
  //      return [tiles[4][tile.position.x - 1]].filter(isDefined);
  //    }
  //    return getHorizontalAdjTiles(tile);
  //  }

  //  var validSideways = function (tile) {
  //    return getPotentialSideways(tile).filter(isNotAtMaxCap);
  //  }

  //  var validForwards = function (tile) {
  //    return getPotentialForwards(tile).filter(isNotAtMaxCap);
  //  }

  //  var validBackwards = function (tile) {
  //    return getPotentialBackwards(tile).filter(isNotAtMaxCap);
  //  }

  //  return {
  //    forwards: validForwards,

  //    backwards: validBackwards,

  //    sideways: validSideways
  //  };
  //})();

  return {
    tiles: tiles,
    piecePositions: piecePositions,
    getPiecesInTile: getPiecesInTile
    //validMoveFuncs: validMoveFuncs,
    //friendlyPieces: friendlyPieces,
    //enemyPieceLocs: enemyPieceLocs,
    ////Less than ideal, only used in tests atm, Not sure I want to use this properly
    //side: playerSide,
    //sideString: playerSide === side.DARK ? side.darkString : side.lightString
  };
}


module.exports =
  {
    makeBoard: makeBoard
  };


