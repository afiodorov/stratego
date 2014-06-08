/*global describe, it*/

'use strict';
var assert = require('assert');
var _ = require('lodash');
var pieces = require('../../public/js/game/structs/pieces.js');
var side = require('../../public/js/game/structs/side.js');

describe('pieces', function() {
  it('length of all pieces', function() {
    assert.equal(_.values(pieces).length, 18);
  });

  it('length of side-specific pieces', function() {
    assert.equal(pieces[side.DARK].length, 9);
  });

  it('pieces are accessible by name', function() {
    assert.equal(pieces.gandalf.strength, 5);
    assert.equal(pieces['flying nazgul'].strength, 3);
  });
});
