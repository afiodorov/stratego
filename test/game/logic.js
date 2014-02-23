/*global describe, it*/
'use strict';
var assert = require('assert');
var _ = require('../../public/js/lib/underscore.js');
var logic = require('../../public/js/game/logic.js');

describe('GameLogic', function() {
  describe('#startingPositions', function() {
    // console.log(logic.generatePiecePositions());
  });

  describe('correct start positions', function() {
    var positions = logic._startingPositions;
    it('#_startingPositions', function() {
      assert.deepEqual(positions.light,
       [[1, 1],
        [1, 1],
        [1, 1],
        [1, 1],
        [2, 1],
        [2, 2],
        [3, 1],
        [3, 2],
        [3, 3]]);
      assert.deepEqual(positions.dark,
       [[7, 1],
        [7, 1],
        [7, 1],
        [7, 1],
        [5, 1],
        [5, 2],
        [5, 3],
        [6, 1],
        [6, 2]]);
    });
  });
});
