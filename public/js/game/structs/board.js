/// <reference path="tile.js" />
/// <reference path="../../lib/underscore.js" />

var SIDE_DARK = 4325897;
var SIDE_LIGHT = 203423487;

var makeBoard = function (side) {
 // We are defining the tiles' position by its' location in the array.
 // All postional relatives will be assuming that the Shire is South, and that Mordor is North.
 // The shire will be at the top of the board with a 0 row index, Mordor at the bottom, with the highest row index.
  var tiles = (function () {
    var makeTile = require('./tile.js');
    var _ = require("../../lib/underscore.js");
    var tilesArr = [];
    _.range(7).forEach(function (i) { tilesArr[i] = []; });


    var addTile = function (name, cap, xpos, ypos) {
      tilesArr[ypos][xpos] = makeTile(name, cap, { x: xpos, y: ypos });
    }
    addTile('The Shire', 4, 0, 0);
    addTile('Arthedam', 2, 0, 1);
    addTile('Cardolan', 2, 1, 1);
    addTile('Rhudaur', 2, 0, 2);
    addTile('Eregion', 2, 1, 2);
    addTile('Enedwaith', 2, 2, 2);
    addTile('The High Pass', 1, 0, 3);
    addTile('Misty Mountains', 1, 1, 3);
    addTile('Caradoras', 1, 2, 3);
    addTile('Gap Of Rohan', 1, 3, 3);
    addTile('Mirkwood', 2, 0, 4);
    addTile('Fangorn', 2, 1, 4);
    addTile('Rohan', 2, 2, 4);
    addTile('Gondor', 2, 0, 5);
    addTile('Dagorlad', 2, 1, 5);
    addTile('Mordor', 4, 0, 6);
    return tilesArr;
  })();

  var sideString = side === SIDE_DARK ? "dark" : "light";


  var validMoveFuncs = (function(){

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

    var isDefined = function(obj){
      return obj !== undefined;
    }

    var isNotAtMaxCap = function (tile) {
      return !tile.isAtMaxCap();
    }

    var getHorizontalAdjTiles = function (tile) {
      return [tiles[tile.position.y][tile.position.x - 1], tiles[tile.position.y][tile.position.x + 1]].filter(isDefined);
    }

    //potential refers to it being prior to the check that the square actually has space.
    var getPotentialForwards = function(tile){
      var forwardTiles = getVerticleAdjTiles(tile, side === SIDE_DARK);
      if (side === SIDE_LIGHT && tile === tiles[2][1]) {//You can take a shortcut from this square if you're on the light side. 
        forwardTiles.push(tiles[4][1]);
      }
      return forwardTiles;
    }

    var getPotentialBackwards = function (tile) {
        return getVerticleAdjTiles(tile, side === SIDE_LIGHT);
    }

    var getPotentialSideways = function(tile){
        if (tile.position.y === 3) {//Mountains, maybe this should be stored in the tile itself?
          return [];
        }
        if (tile.position.y === 4) {//River, see above.
          if (side === SIDE_DARK) {
            return [];
          }
          return [tiles[4][tile.position.x -1]].filter(isDefined);
        }
        return getHorizontalAdjTiles(tile);
      }

    var validSideways = function(tile){
      return getPotentialSideways(tile).filter(isNotAtMaxCap);
    }

    var validForwards = function(tile){
      return getPotentialForwards(tile).filter(isNotAtMaxCap);
    }

    var validBackwards = function(tile){
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
    sideString: sideString,
    validMoveFuncs: validMoveFuncs
  };
}


module.exports = 
  {
    makeBoard: makeBoard,
    SIDE_DARK: SIDE_DARK,
    SIDE_LIGHT: SIDE_LIGHT
  };


