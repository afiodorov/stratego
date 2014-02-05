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
  });

  var tilesCount = _.range(1, gameStructs.tiles.NUM_OF_ROWS);

  describe('tiles', function(){
    it('is array', function() {
      assert.equal('[object Array]', Object.prototype.toString.call(gameStructs.tiles));
    });
  });
});
