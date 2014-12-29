'use strict';

var side = require('./../structs/side.js');
var tiles = require('./../structs/tiles.js');
var Tile = require('./tile.js');
var fabric = require('fabric').fabric;
var _ = require('lodash');

var BOARD_WIDTH = 600;
var BOARD_HEIGHT = 600;

var Board = function() {

  var tilesGroup = _.flatten(tiles).map(function(tile) {
    var width = BOARD_WIDTH / tiles[tile.position.row].length;
    var height = BOARD_HEIGHT / tiles.length;
    var top = tile.position.row * height;
    var left = tile.position.col * width;

    return new Tile(tile.name, width, height, top, left);
  });

  return new fabric.Group(tilesGroup);
};

module.exports = Board;
