/*global describe, it*/
"use strict";
var assert = require("assert");
var _ = require("../public/lib/underscore.js");
var GameState = require("../public/utils/gameState.js").GameState;

describe('GameState', function() {
  var darkState = new GameState(
    {mySide: "dark",
      light: {
        piecesLeft: 
        [
          {position: [2,2]},
          {position: [2,2]},
          {position: [3,1]}
        ]
      },
      dark: {
        piecesLeft: 
        [
          {name: "witch king", position: [7,1]},
          {name: "black rider", position: [7,1]},
          {name: "warg", position: [7,1]},
          {name: "flying nazgul", position: [6,2]},
          {name: "barlog", position: [6,2]},
          {name: "cave troll", position: [6,1]},
          {name: "orcs", position: [5,1]},
          {name: "shelob", position: [5,1]},
          {name: "saruman", position: [4,4]}
        ]
      }
    }
  );
  var lightState = new GameState({mySide: "light"});

  describe('#getSide', function() {
    it('should return side', function() {
      assert.equal("light", lightState.getSide());
      assert.equal("dark", darkState.getSide());
    });
  });

  describe('#isTileWithEnemy', function() {
    it('', function() {
      assert.equal(true, darkState.isTileWithEnemy([2,2]));
      assert.equal(true, darkState.isTileWithEnemy([3,1]));
      assert.equal(false, darkState.isTileWithEnemy([1,1]));
    });
  });

  describe('#piecesCount', function() {
    it('counting number of pieces in a tile', function() {
      assert.equal(2, darkState.piecesCount([6,2]));
    });
  });

  describe('#isTileFull', function() {
    it('checks if tiles are full', function() {
      assert.equal(true, darkState.isTileFull([6,2]));
      assert.equal(true, darkState.isTileFull([5,1]));
      assert.equal(true, darkState.isTileFull([4,4]));
      assert.equal(false, darkState.isTileFull([7,1]));
      assert.equal(false, darkState.isTileFull([6,1]));
    });
  });
});