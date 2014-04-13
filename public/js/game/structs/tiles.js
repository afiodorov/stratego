'use strict';
var _ = require('../../lib/underscore.js');

var Tile = function(name, capacity, index) {
  this.name = name;
  this.capacity = capacity;
  this.index = index;
};

var tilesArr = [];
_.range(7).forEach(function(i) {tilesArr[i] = [];});
tilesArr[0][0] = new Tile('The Shire'       , 4, [0, 0]);
tilesArr[1][0] = new Tile('Arthedam'        , 2, [1, 0]);
tilesArr[1][1] = new Tile('Cardolan'        , 2, [1, 1]);
tilesArr[2][0] = new Tile('Rhudaur'         , 2, [2, 0]);
tilesArr[2][1] = new Tile('Eregion'         , 2, [2, 1]);
tilesArr[2][2] = new Tile('Enedwaith'       , 2, [2, 2]);
tilesArr[3][0] = new Tile('The High Pass'   , 1, [3, 0]);
tilesArr[3][1] = new Tile('Misty Mountains' , 1, [3, 1]);
tilesArr[3][2] = new Tile('Caradoras'       , 1, [3, 2]);
tilesArr[3][3] = new Tile('Gap Of Rohan'    , 1, [3, 3]);
tilesArr[4][0] = new Tile('Mirkwood'        , 2, [4, 0]);
tilesArr[4][1] = new Tile('Fangorn'         , 2, [4, 1]);
tilesArr[4][2] = new Tile('Rohan'           , 2, [4, 2]);
tilesArr[5][0] = new Tile('Gondor'          , 2, [5, 0]);
tilesArr[5][1] = new Tile('Dagorlad'        , 2, [5, 1]);
tilesArr[6][0] = new Tile('Mordor'          , 4, [6, 0]);

var numCols = function(rowNumber) {return tilesArr[rowNumber].length;};

/**
 * @param {array|number} row_ either row (starts from 1) or index, e.g. [1,1]
 * @param {number} col_ column number (starts from 1)
 *
 * @return {boolean} Returns whether grid index is valid. [1,1] is the first
 * tile
 */
var isWithinGrid = function(row_, col_) {
  var row = row_;
  var col = col_;

  if (Object.prototype.toString.call(row_) === '[object Array]') {
    if (row_.length !== 2) {
      throw new TypeError('Call with coordinates array of length 2');
    }
    row = row_[0];
    col = row_[1];
  }

  if (isNaN(row) || row < 0 || row > tilesArr.length - 1) {
    return false;
  }

  if (isNaN(col) || col < 0 || col > numCols(row) - 1) {
    return false;
  }

  return true;
};


/**
 * Get all the forward tiles, where direction of a board is fixed
 * @return {array} array of all indices for tiles ahead of a tile, empty array
 * for the last tile
 */
Tile.prototype.getForwardTiles = function() {
  var res = new Array(0);
  res.push([this.index[0] + 1, this.index[1]]);
  if (this.index[0] >= Math.floor(tilesArr.length / 2)) {
    res.push([this.index[0] + 1, this.index[1] - 1]);
  } else {
    res.push([this.index[0] + 1, this.index[1] + 1]);
  }
  return res.filter(isWithinGrid).sort();
};

/**
 * Get all the backward tiles, where direction of a board is fixed
 * @return {array} array of all indices of tiles behind the tile, empty array
 * for the tile [1,1]
 */
Tile.prototype.getBackwardTiles = function() {
  var res = new Array(0);
  res.push([this.index[0] - 1, this.index[1]]);
  if (this.index[0] > Math.floor(tilesArr.length / 2)) {
    res.push([this.index[0] - 1, this.index[1] + 1]);
  } else {
    res.push([this.index[0] - 1, this.index[1] - 1]);
  }
  return res.filter(isWithinGrid).sort();
};

/**
 * @return {array} array of all side tiles, with an exception of a middle tile,
 * where no tiles are returned
 */
Tile.prototype.getReachableSideTiles = function() {
  var res = new Array(0);
  if (this.index[0] === Math.floor(tilesArr.length / 2)) {
    return res;
  }
  res.push([this.index[0], this.index[1] - 1]);
  res.push([this.index[0], this.index[1] + 1]);
  return res.filter(isWithinGrid);
};

var tiles = (function() {
  var makeTiles = function(tiles) {
    var mytiles = new Array(0);
    tilesArr.forEach(function(row) {
      row.forEach(function(tile) {
        mytiles.push(tile);
        Object.defineProperty(mytiles, tile.index, {
          enumerable: false,
          value: tile
        });
      });
    });

    mytiles.numRows = tilesArr.length;
    Object.defineProperty(mytiles, 'numRows', {
      enumerable: false
    });

    mytiles.numCols = numCols;
    Object.defineProperty(mytiles, 'numCols', {
      enumerable: false
    });

    mytiles.arr = tiles;
    Object.defineProperty(mytiles, 'tiles', {
      enumerable: false
    });

    mytiles.isWithin = isWithinGrid;
    Object.defineProperty(mytiles, 'isWithin', {
      enumerable: false
    });

    /**
     * Returns a tile. First tile is indexed as [1, 1]
     * @param {number} row
     * @param {number} col
     * @return Tile object
     */
    mytiles.get = function(row, col) {
      return mytiles[[row, col]];
    };
    Object.defineProperty(mytiles, 'get', {
      enumerable: false
    });

    Object.defineProperty(mytiles, 'isWithin', {
      enumerable: false
    });

    Object.freeze(mytiles);
    return mytiles;
  };

  return makeTiles(tilesArr);
}());

module.exports = tiles;
