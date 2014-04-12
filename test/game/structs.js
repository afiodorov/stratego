/*global describe, it*/
'use strict';
var assert = require('assert');
var _ = require('../../public/js/lib/underscore.js');
var gameStructs = require('../../public/js/game/structs.js');

describe('GameStruct', function() {
  describe('tiles', function() {
    it('can access through a double index', function() {
      assert.equal('The Shire',       gameStructs.tiles[[0, 0]].name);
      assert.equal('Arthedam',        gameStructs.tiles[[1, 0]].name);
      assert.equal('Cardolan',        gameStructs.tiles[[1, 1]].name);
      assert.equal('Rhudaur',         gameStructs.tiles[[2, 0]].name);
      assert.equal('Eregion',         gameStructs.tiles[[2, 1]].name);
      assert.equal('Enedwaith',       gameStructs.tiles[[2, 2]].name);
      assert.equal('The High Pass',   gameStructs.tiles[[3, 0]].name);
      assert.equal('Misty Mountains', gameStructs.tiles[[3, 1]].name);
      assert.equal('Caradoras',       gameStructs.tiles[[3, 2]].name);
      assert.equal('Gap Of Rohan',    gameStructs.tiles[[3, 3]].name);
      assert.equal('Mirkwood',        gameStructs.tiles[[4, 0]].name);
      assert.equal('Fangorn',         gameStructs.tiles[[4, 1]].name);
      assert.equal('Rohan',           gameStructs.tiles[[4, 2]].name);
      assert.equal('Gondor',          gameStructs.tiles[[5, 0]].name);
      assert.equal('Dagorlad',        gameStructs.tiles[[5, 1]].name);
      assert.equal('Mordor',          gameStructs.tiles[[6, 0]].name);
    });

    var correctTilesCount = _.range(gameStructs.tiles.numRows)
      .reduceRight(
          function(res, i) {return res + gameStructs.tiles.numCols(i); },
          0);
    var tilesCount = gameStructs.tiles.reduceRight(
        function(res) {return res + 1;}, 0);
    it('is array', function() {
      assert.equal('[object Array]',
        Object.prototype.toString.call(gameStructs.tiles));
    });

    it('correct number of tiles through forEach', function() {
      assert.equal(correctTilesCount, tilesCount);
    });

    it('correct number of tiles through for', function() {
      assert.equal(correctTilesCount, gameStructs.tiles.length);
    });
  });

  describe('tile', function() {
    it('#numCols', function() {
      assert.equal(3, gameStructs.tiles.numCols(2));
      assert.equal(4, gameStructs.tiles.numCols(3));
      assert.equal(3, gameStructs.tiles.numCols(4));
      assert.equal(2, gameStructs.tiles.numCols(5));
      assert.equal(1, gameStructs.tiles.numCols(6));
    });

    it('#isWithin', function() {
      assert.equal(true, gameStructs.tiles.isWithin(1, 1));
      assert.equal(true, gameStructs.tiles.isWithin([0, 0]));
      assert.equal(true, gameStructs.tiles.isWithin([1, 0]));
      assert.equal(true, gameStructs.tiles.isWithin([1, 1]));
      assert.equal(true, gameStructs.tiles.isWithin([2, 0]));
      assert.equal(true, gameStructs.tiles.isWithin([2, 1]));
      assert.equal(true, gameStructs.tiles.isWithin([2, 2]));
      assert.equal(true, gameStructs.tiles.isWithin([3, 0]));
      assert.equal(true, gameStructs.tiles.isWithin([3, 1]));
      assert.equal(true, gameStructs.tiles.isWithin([3, 2]));
      assert.equal(true, gameStructs.tiles.isWithin([3, 3]));
      assert.equal(true, gameStructs.tiles.isWithin([4, 0]));
      assert.equal(true, gameStructs.tiles.isWithin([4, 1]));
      assert.equal(true, gameStructs.tiles.isWithin([4, 2]));
      assert.equal(true, gameStructs.tiles.isWithin([5, 0]));
      assert.equal(true, gameStructs.tiles.isWithin([5, 1]));
      assert.equal(true, gameStructs.tiles.isWithin([6, 0]));
      assert.equal(false, gameStructs.tiles.isWithin([-2, 0]));
      assert.equal(false, gameStructs.tiles.isWithin([4, 3]));
    });
  });

  describe('tile', function() {
    it('#getBackwardTiles', function() {
      assert.deepEqual([], gameStructs.tiles[[0, 0]].getBackwardTiles());
      assert.deepEqual([[1, 1]], gameStructs.tiles[[2, 2]].getBackwardTiles());
      assert.deepEqual([[3, 1], [3, 2]],
        gameStructs.tiles[[4, 1]].getBackwardTiles());
      assert.deepEqual([[5, 0], [5, 1]],
        gameStructs.tiles[[6, 0]].getBackwardTiles());
    });
    it('#getForwardTiles', function() {
      assert.deepEqual([[1, 0], [1, 1]],
        gameStructs.tiles[[0, 0]].getForwardTiles());
      assert.deepEqual([[2, 0], [2, 1]],
        gameStructs.tiles[[1, 0]].getForwardTiles());
      assert.deepEqual([[4, 1], [4, 2]],
        gameStructs.tiles[[3, 2]].getForwardTiles());
      assert.deepEqual([[4, 2]], gameStructs.tiles[[3, 3]].getForwardTiles());
      assert.deepEqual([[5, 0], [5, 1]],
        gameStructs.tiles[[4, 1]].getForwardTiles());
      assert.deepEqual([[5, 0]], gameStructs.tiles[[4, 0]].getForwardTiles());
      assert.deepEqual([], gameStructs.tiles[[6, 0]].getForwardTiles());
    });
    it('#getReachableSideTiles', function() {
      assert.deepEqual([], gameStructs.tiles[[3, 1]].getReachableSideTiles());
      assert.deepEqual([], gameStructs.tiles[[0, 0]].getReachableSideTiles());
      assert.deepEqual([[4, 0], [4, 2]], gameStructs.tiles[[4, 1]].getReachableSideTiles());
      assert.deepEqual([[5, 0]], gameStructs.tiles[[5, 1]].getReachableSideTiles());
    });
  });
});
