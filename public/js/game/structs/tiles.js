"use strict";
var _ = require('../../lib/underscore.js');

var tiles = (function() {
  var NUM_OF_ROWS = 7;
  var NUM_OF_COLS = 4;

  var columnLimit = function(colNumber) {
    return (colNumber > NUM_OF_ROWS / 2) ? NUM_OF_ROWS + 1 - colNumber : colNumber;
  };

  /** 
   * Returns whether a grid index is valid
   * Call with int, int or [int, int]
   */
  var isWithinGrid = function(row_, col_) {
    var row = row_;
    var col = col_;

    if( Object.prototype.toString.call( row_ ) === "[object Array]" ) {
      if( row_.length !== 2 ) {
        throw new TypeError("Call with coordinates array of length 2");
      }
      row = row_[0];
      col = row_[1];
    }

    if(isNaN(row) || row < 1 || row > NUM_OF_ROWS) {
      return false;
    }

    if(isNaN(col) || col < 1 || col > columnLimit(row)) {
      return false;
    }

    return true;
  };

  var tiles = [];
  _.range(1, NUM_OF_ROWS + 1).forEach(function(i) { tiles[i] = []; });

  var Tile = function(name, capacity, index) {
    this.name = name;
    this.capacity = capacity;
    this.index = index;
  };

  /* get all forward tiles */
  Tile.prototype.getForward = function() {
    var res = new Array(0);
    res.push([this.index[0]+1, this.index[1]]);
    if(this.index[0] > NUM_OF_ROWS / 2) {
      res.push([this.index[0]+1, this.index[1]-1]);
    } else {
      res.push([this.index[0]+1, this.index[1]+1]);
    }
    return res.filter(isWithinGrid).sort();
  };

  /* get all backward tiles */
  Tile.prototype.getBackward = function() {
    var res = new Array(0);
    res.push([this.index[0]-1, this.index[1]]);
    if(this.index[0] > Math.ceil(NUM_OF_ROWS / 2)) {
      res.push([this.index[0]-1, this.index[1]+1]);
    } else {
      res.push([this.index[0]-1, this.index[1]-1]);
    }
    return res.filter(isWithinGrid).sort();
  };

  /* get all side tiles */
  Tile.prototype.getSide = function() {
    var res = new Array(0);
    res.push([this.index[0], this.index[1]-1]);
    res.push([this.index[0], this.index[1]+1]);
    return res.filter(isWithinGrid);
  };

  tiles[1][1] = new Tile( "The Shire"       , 4, [1, 1] );
  tiles[2][1] = new Tile( "Arthedam"        , 2, [2, 1] );
  tiles[2][2] = new Tile( "Cardolan"        , 2, [2, 2] );
  tiles[3][1] = new Tile( "Rhudaur"         , 2, [3, 1] );
  tiles[3][2] = new Tile( "Eregion"         , 2, [3, 2] );
  tiles[3][3] = new Tile( "Enedwaith"       , 2, [3, 3] );
  tiles[4][1] = new Tile( "The High Pass"   , 1, [4, 1] );
  tiles[4][2] = new Tile( "Misty Mountains" , 1, [4, 2] );
  tiles[4][3] = new Tile( "Caradoras"       , 1, [4, 3] );
  tiles[4][4] = new Tile( "Gap Of Rohan"    , 1, [4, 4] );
  tiles[5][1] = new Tile( "Mirkwood"        , 2, [5, 1] );
  tiles[5][2] = new Tile( "Fangorn"         , 2, [5, 2] );
  tiles[5][3] = new Tile( "Rohan"           , 2, [5, 3] );
  tiles[6][1] = new Tile( "Gondor"          , 2, [6, 1] );
  tiles[6][2] = new Tile( "Dagorlad"        , 2, [6, 2] );
  tiles[7][1] = new Tile( "Mordor"          , 4, [7, 1] );

  var makeTiles = function(tiles) {
    var mytiles = new Array(0);
    _.range(1, NUM_OF_ROWS + 1).forEach(function(i){
      _.range(1, columnLimit(i) + 1).forEach(function(j) {
        mytiles.push(tiles[i][j]);
        Object.defineProperty(mytiles, [[i,j]], {
          enumerable: false,
          value: tiles[i][j]
        });
      });
    });

    mytiles.NUM_OF_ROWS = NUM_OF_ROWS;
    Object.defineProperty(mytiles, "NUM_OF_ROWS", {
      enumerable: false,
    });

    mytiles.NUM_OF_COLS = NUM_OF_COLS;
    Object.defineProperty(mytiles, "NUM_OF_COLS", {
      enumerable: false,
    });

    mytiles.columnLimit = columnLimit;
    Object.defineProperty(mytiles, "columnLimit", {
      enumerable: false,
    });

    mytiles.isWithin = isWithinGrid;
    Object.defineProperty(mytiles, "isWithin", {
      enumerable: false,
    });

    Object.freeze(mytiles);
    return mytiles;
  };

  return makeTiles(tiles);
}());

module.exports = {
  tiles : tiles
};
