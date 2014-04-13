/*global describe, it*/
'use strict';
var assert = require('assert');
var _ = require('../../public/js/lib/underscore.js');
var tiles = require('../../public/js/game/structs/pieces.js');
var side = require('../../public/js/game/structs/side.js');

describe('pieces', function() {
  it('length of all pieces', function() {
    assert.equal(tiles.length, 18);
  });
  it('length of side-specific pieces', function() {
    assert.equal(tiles[side.DARK].length, 9);
  });
});
