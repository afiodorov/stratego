/*global describe, it*/
var assert = require("assert");
var _ = require("../public/lib/underscore.js");
var gameStructs = require("../public/utils/gameStructs.js");

describe('GameStruct', function(){
  describe('tiles', function() {
    it('can access through a double index', function(){
      assert.equal("The Shire",       gameStructs.tiles[[1,1]].name);
      assert.equal("Arthedam",        gameStructs.tiles[[2,1]].name);
      assert.equal("Cardolan",        gameStructs.tiles[[2,2]].name);
      assert.equal("Rhudaur",         gameStructs.tiles[[3,1]].name);
      assert.equal("Eregion",         gameStructs.tiles[[3,2]].name);
      assert.equal("Enedwaith",       gameStructs.tiles[[3,3]].name);
      assert.equal("The High Pass",   gameStructs.tiles[[4,1]].name);
      assert.equal("Misty Mountains", gameStructs.tiles[[4,2]].name);
      assert.equal("Caradoras",       gameStructs.tiles[[4,3]].name);
      assert.equal("Gap Of Rohan",    gameStructs.tiles[[4,4]].name);
      assert.equal("Mirkwood",        gameStructs.tiles[[5,1]].name);
      assert.equal("Fangorn",         gameStructs.tiles[[5,2]].name);
      assert.equal("Rohan",           gameStructs.tiles[[5,3]].name);
      assert.equal("Gondor",          gameStructs.tiles[[6,1]].name);
      assert.equal("Dagorlad",        gameStructs.tiles[[6,2]].name);
      assert.equal("Mordor",          gameStructs.tiles[[7,1]].name);
    });

    var correctTilesCount = _.range(1, gameStructs.tiles.NUM_OF_ROWS + 1).reduceRight(
          function(res, i) {return res + gameStructs.tiles.columnLimit(i); },
          0);
    var tilesCount = gameStructs.tiles.reduceRight(function(res) {return res + 1;}, 0);
    it('is array', function() {
      assert.equal('[object Array]', Object.prototype.toString.call(gameStructs.tiles));
    });

    it('correct number of tiles through forEach', function() {
      assert.equal(correctTilesCount, tilesCount);
    });

    it('correct number of tiles through for', function() {
      assert.equal(correctTilesCount, gameStructs.tiles.length);
    });
  });

  describe('tile', function() {
    it('#columnLimit', function() {
      assert.equal(3, gameStructs.tiles.columnLimit(3));
      assert.equal(4, gameStructs.tiles.columnLimit(4));
      assert.equal(3, gameStructs.tiles.columnLimit(5));
      assert.equal(2, gameStructs.tiles.columnLimit(6));
      assert.equal(1, gameStructs.tiles.columnLimit(7));
    });

    it('#isWithin', function() {
      assert.equal(true, gameStructs.tiles.isWithin(1,1));
      assert.equal(true, gameStructs.tiles.isWithin([1,1]));
      assert.equal(true, gameStructs.tiles.isWithin([2,1]));
      assert.equal(true, gameStructs.tiles.isWithin([2,2]));
      assert.equal(true, gameStructs.tiles.isWithin([3,1]));
      assert.equal(true, gameStructs.tiles.isWithin([3,2]));
      assert.equal(true, gameStructs.tiles.isWithin([3,3]));
      assert.equal(true, gameStructs.tiles.isWithin([4,1]));
      assert.equal(true, gameStructs.tiles.isWithin([4,2]));
      assert.equal(true, gameStructs.tiles.isWithin([4,3]));
      assert.equal(true, gameStructs.tiles.isWithin([4,4]));
      assert.equal(true, gameStructs.tiles.isWithin([5,1]));
      assert.equal(true, gameStructs.tiles.isWithin([5,2]));
      assert.equal(true, gameStructs.tiles.isWithin([5,3]));
      assert.equal(true, gameStructs.tiles.isWithin([6,1]));
      assert.equal(true, gameStructs.tiles.isWithin([6,2]));
      assert.equal(true, gameStructs.tiles.isWithin([7,1]));
      assert.equal(false, gameStructs.tiles.isWithin([-1,1]));
      assert.equal(false, gameStructs.tiles.isWithin([5,4]));
    });
  });

  describe('tile', function() {
    it('#getBackward', function() {
      assert.deepEqual([], gameStructs.tiles[[1,1]].getBackward());
      assert.deepEqual([[3,3]], gameStructs.tiles[[4,4]].getBackward());
      assert.deepEqual([[4,2],[4,3]], gameStructs.tiles[[5,2]].getBackward());
      assert.deepEqual([[6,1],[6,2]], gameStructs.tiles[[7,1]].getBackward());
    });
    it('#getForward', function() {
      assert.deepEqual([[2,1], [2,2]], gameStructs.tiles[[1,1]].getForward());
      assert.deepEqual([[3,1], [3,2]], gameStructs.tiles[[2,1]].getForward());
      assert.deepEqual([[5,2], [5,3]], gameStructs.tiles[[4,3]].getForward());
      assert.deepEqual([[5,3]], gameStructs.tiles[[4,4]].getForward());
      assert.deepEqual([[6,1], [6,2]], gameStructs.tiles[[5,2]].getForward());
      assert.deepEqual([[6,1]], gameStructs.tiles[[5,1]].getForward());
      assert.deepEqual([], gameStructs.tiles[[7,1]].getForward());
    });
  });
});
