﻿'use strict';

var side = require('./../structs/side.js');
var tiles = require('./../structs/tiles.js');
var Tile = require('./tile.js');
var fabric = require('fabric').fabric;
var _ = require('lodash');

var Board = function(boardWidth, boardHeight) {

  var tilesGroup = _.flatten(tiles).map(function(tileStruct) {
    var width = boardWidth / tiles[tileStruct.position.row].length;
    var height = boardHeight / tiles.length;
    var top = tileStruct.position.row * height;
    var left = tileStruct.position.col * width;

    return new Tile(tileStruct, width, height, top, left);
  });

  this.gui = new fabric.Group(_.pluck(tilesGroup, 'gui'));

  var self = this;
  self.tiles = [];
  tilesGroup.forEach(function(tile) {
    if(!_.isArray(self.tiles[tile.position.row])) {
      self.tiles[tile.position.row] = [];
    }
    self.tiles[tile.position.row][tile.position.col] = tile;
  });
};

module.exports = Board;
