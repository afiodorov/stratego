'use strict';

var tiles = [];
var _ = require('../../lib/underscore.js');

var Tile = require('./tile.js');
var Position = require('./position.js');

var addTile = function(name, cap, col, row) {
  if(!_.isArray(tiles[row])) {
    tiles[row] = [];
  }
  tiles[row][col] = new Tile(name, cap, new Position(row, col));
};

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

(function defineGetProperty () {
  /**
  * Get a tile
  * @param {object|...number} position of tile, can be called with (0, 0)
  * @config {number} [row] row of a tile on a board
  * @config {number} [col] column of a tile on a board
  * @return {object} the tile at the position
  */
  var getTile = function(position) {
    var row, col;
    if (arguments.length === 1) {
      row = position.row;
      col = position.col;
    } else if (arguments.length === 2) {
      row = arguments[0];
      col = arguments[1];
    } else {
      // error case - wrong number of arguments
      return {};
    }

    return tiles[row][col];
  };

  tiles.get = getTile;
  Object.defineProperty(tiles, 'get', {
    enumerable: false,
  });
}());

Object.freeze(tiles);

module.exports = tiles;
