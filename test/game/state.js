/*global describe, it*/
'use strict';
var assert = require('assert');
var _ = require('../../public/js/lib/underscore.js');
var stateHolder = require('../../public/js/game/stateHolder.js');

describe('GameState', function() {
  var darkState = new stateHolder(
    {mySide: 'dark',
      light: {
        pieces:
        [
          {position: [1, 1]},
          {position: [1, 1]},
          {position: [2, 0]}
        ]
      },
      dark: {
        pieces:
        [
          {name: 'witch king', position: [6, 0]},
          {name: 'black rider', position: [6, 0]},
          {name: 'warg', position: [6, 0]},
          {name: 'flying nazgul', position: [5, 1]},
          {name: 'barlog', position: [5, 1]},
          {name: 'cave troll', position: [5, 0]},
          {name: 'orcs', position: [4, 0]},
          {name: 'shelob', position: [4, 0]},
          {name: 'saruman', position: [3, 3]}
        ]
      }
    }
  );
  var lightState = new stateHolder({mySide: 'light'});

  describe('#getSide', function() {
    it('should return side', function() {
      assert.equal('light', lightState.getSide());
      assert.equal('dark', darkState.getSide());
    });
  });

  describe('#isTileWithEnemy', function() {
    it('', function() {
      assert.equal(true, darkState.isTileWithEnemy([1, 1]));
      assert.equal(true, darkState.isTileWithEnemy([2, 0]));
      assert.equal(false, darkState.isTileWithEnemy([0, 0]));
    });
  });

  describe('#piecesCount', function() {
    it('counting number of pieces in a tile', function() {
      assert.equal(2, darkState.piecesCount([5, 1]));
    });
  });

  describe('#isTileFull', function() {
    it('checks if tiles are full', function() {
      assert.equal(true, darkState.isTileFull([5, 1]));
      assert.equal(true, darkState.isTileFull([4, 0]));
      assert.equal(false, darkState.isTileFull([4, 2]));
      assert.equal(false, darkState.isTileFull([6, 0]));
      assert.equal(false, darkState.isTileFull([5, 0]));
    });
  });
});
