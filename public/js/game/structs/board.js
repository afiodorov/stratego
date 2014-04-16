/// <reference path="tile.js" />
/// <reference path="../../lib/underscore.js" />
/// <reference path="piece.js" />
/// <reference path="side.js" />

var side = require('./side.js');

var allPieces = require('./pieces.js');

var makeBoard = function (gameState) {
  // We are defining the tiles' position by its' location in the array.
  // All postional relatives will be assuming that the Shire is South, and that Mordor is North.
  // The shire will be at the top of the board with a 0 row index, Mordor at the bottom, with the highest row index.
  var tiles = require('./tiles.js');

  //var friendlyPieces = gameState.friendlyPieces.map(function (p) { return allPieces[p.name]; });

  function getTile(pos) {
    return tiles[pos.row][pos.col];
  }

  (function assignPiecesToTiles() {
    for (var i = 0; i < gameState.friendlyPieces.length; i++) {
      getTile(gameState.friendlyPieces[i].position).addPiece(allPieces[gameState.friendlyPieces[i].name]);
    };
    var makePiece = require('./piece.js');
    for (var i = 0; i < gameState.enemyPieces.length; i++) {
      //The only part of the enemy pieces that get used should be the name, and not the real name.
      //If anything else is called from enemy pieces found in the tile, there should be many an error.
      getTile(gameState.enemyPieces[i].position).addPiece(makePiece('???', undefined, undefined, undefined));
    };

  })();


  //var playerSide = friendlyPieces[0].side;

  var validMoveFuncs = (function () {

    var getVerticleAdjTiles = function (tile, goingNorth) {
      var targetRow = tile.position.y + (goingNorth ? -1 : +1);
      if (targetRow >= tiles.length || targetRow < 0) {
        return [];//ensures tiles[targetRow] always exists below.
      }
      if (tiles[targetRow].length > tiles[tile.position.y].length) {
        return [tiles[targetRow][tile.position.x], tiles[targetRow][tile.position.x + 1]];
      }
      else {
        return [tiles[targetRow][tile.position.x], tiles[targetRow][tile.position.x - 1]].filter(isDefined);
      }
    }

    var isDefined = function (obj) {
      return obj !== undefined;
    }

    var isNotAtMaxCap = function (tile) {
      return !tile.isAtMaxCap();
    }

    var getHorizontalAdjTiles = function (tile) {
      return [tiles[tile.position.y][tile.position.x - 1], tiles[tile.position.y][tile.position.x + 1]].filter(isDefined);
    }

    //potential refers to it being prior to the check that the square actually has space.
    var getPotentialForwards = function (tile) {
      var forwardTiles = getVerticleAdjTiles(tile, playerSide === side.DARK);
      if (playerSide === side.LIGHT && tile === tiles[2][1]) {//You can take a shortcut from this square if you're on the light side. 
        forwardTiles.push(tiles[4][1]);
      }
      return forwardTiles;
    }

    var getPotentialBackwards = function (tile) {
      return getVerticleAdjTiles(tile, playerSide === side.LIGHT);
    }

    var getPotentialSideways = function (tile) {
      if (tile.position.y === 3) {//Mountains, maybe this should be stored in the tile itself?
        return [];
      }
      if (tile.position.y === 4) {//River, see above.
        if (playerSide === side.DARK) {
          return [];
        }
        return [tiles[4][tile.position.x - 1]].filter(isDefined);
      }
      return getHorizontalAdjTiles(tile);
    }

    var validSideways = function (tile) {
      return getPotentialSideways(tile).filter(isNotAtMaxCap);
    }

    var validForwards = function (tile) {
      return getPotentialForwards(tile).filter(isNotAtMaxCap);
    }

    var validBackwards = function (tile) {
      return getPotentialBackwards(tile).filter(isNotAtMaxCap);
    }

    return {
      forwards: validForwards,

      backwards: validBackwards,

      sideways: validSideways
    };
  })();

  return {
    tiles: tiles,
    validMoveFuncs: validMoveFuncs,
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


