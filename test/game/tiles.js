/*global describe, it*/

'use strict';
var assert = require('assert');
var _ = require('../../public/js/lib/underscore.js');
var tiles = require('../../public/js/game/structs/tiles.js');

describe('tiles', function() {
  it('number of rows', function() {
    assert.equal(tiles.length, 7);
  });

  it('number of columns', function() {
    assert.equal(tiles[3].length, 4);
  });

  it('#get works with a pair of arguments', function() {
    assert.equal(tiles.get(0, 0).name, 'The Shire');
  });

  it('#get works with a position', function() {
    assert.equal(tiles.get({row: 1, col: 0}).name, 'Arthedam');
  });
});
