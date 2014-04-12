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
    return tilesArr
    ;
    return 6;
  })();

  var validMoveFuncs = {
    forwardTiles: function (tile) {
      var targetRow = side === tile.position.y + (SIDE_DARK ? -1 : 1);
      if (tiles[targetRow].length > tiles[tile.position.y]) {
        return [tiles[targetRow][tile.position.x], tiles[targetRow][tile.position.x + 1]];
      }
      else {
        return [tiles[targetRow][tile.position.x], tiles[targetRow][tile.position.x - 1]].filter(function (x){return x === undefined});
      }
    },
 
    backwardTiles: function (){
      
    },
 
    sideTiles: function () {

    }     
 
  };
 
  return {
    tiles: tiles,
    validMoveFuncs: validMoveFuncs
  };
}


module.exports = 
  {
    makeBoard: makeBoard,
    SIDE_DARK: SIDE_DARK,
    SIDE_LIGHT: SIDE_LIGHT
  };


