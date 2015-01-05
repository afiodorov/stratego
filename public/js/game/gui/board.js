'use strict';
/*jslint node: true*/

var side = require('./../structs/side.js');
var tiles = require('./../structs/tiles.js');
var Tile = require('./tile.js');
var fabric = require('fabric').fabric;
var _ = require('lodash');

/**
 * @constructor
 * @param {fabric.Canvas} canvas reference to instance
 * @param {number} boardWidth board's width in pixels
 * @param {number} boardHeight board's height in pixels
 */
var Board = function(canvas, boardWidth, boardHeight) {

  var tilesGroup = _.flatten(tiles).map(function(tileStruct) {
    var width = boardWidth / tiles[tileStruct.position.row].length;
    var height = boardHeight / tiles.length;
    var top = tileStruct.position.row * height;
    var left = tileStruct.position.col * width;

    return new Tile(canvas, tileStruct, width, height, top, left);
  });

  this.canvas = canvas;

  var self = this;
  self.tiles = [];
  tilesGroup.forEach(function(tile) {
    if (!_.isArray(self.tiles[tile.position.row])) {
      self.tiles[tile.position.row] = [];
    }
    self.tiles[tile.position.row][tile.position.col] = tile;
  });
};

/**
 */
module.exports = Board;
