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
 * @param {object} paramArgs parameters as in fabric.Object
 */
var Board = function(canvas, paramArgs) {

  var defaults = _.partialRight(_.assign, function(a, b) {
    return (a === undefined) ? b : a;
  });

  var defaultValues = {
    top: 0,
    left: 20
  };

  var params = defaults(_.clone(paramArgs), defaultValues);

  var tilesGroup = _.flatten(tiles).map(function(tileStruct) {
    var width = params.width / tiles[tileStruct.position.row].length;
    var height = params.height / tiles.length;
    var top = params.top + tileStruct.position.row * height;
    var left = params.left + tileStruct.position.col * width;

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
