/*global describe, it*/
'use strict';
var assert = require('assert');
var _ = require('../../public/js/lib/lodash.js');
var logic = require('../../public/js/game/logic.js');
var side = require('../../public/js/game/structs/side.js');
var pieces = require('../../public/js/game/structs/pieces.js');
var Position = require('../../public/js/game/structs/position.js');
var fs = require('fs');

describe('GameLogic', function() {
  describe('#starting dark position', function() {
    var darkStartPositions = logic.generateStartPosition(side.DARK);
    assert.deepEqual(darkStartPositions.map(_.property('name')),
      pieces[side.DARK].map(_.property('name')));
    assert.equal(4,
      darkStartPositions.map(_.property('position'))
      .filter(_.partial(_.isEqual, new Position(6, 0))).length);
    assert.equal(1,
      darkStartPositions.map(_.property('position'))
      .filter(_.partial(_.isEqual, new Position(5, 0))).length);
  });

  describe('#starting light position', function() {
    var lightStartPositions = logic.generateStartPosition(side.LIGHT);
    assert.deepEqual(lightStartPositions.map(_.property('name')),
      pieces[side.LIGHT].map(_.property('name')));
    assert.equal(4,
      lightStartPositions.map(_.property('position'))
      .filter(_.partial(_.isEqual, new Position(0, 0))).length);
    assert.equal(1,
      lightStartPositions.map(_.property('position'))
      .filter(_.partial(_.isEqual, new Position(2, 1))).length);
    assert.equal(1,
      lightStartPositions.map(_.property('position'))
      .filter(_.partial(_.isEqual, new Position(1, 1))).length);
  });


  describe('correctPieceSide', function() {
    it('#getValidMoveTiles', function() {
      var path = require('path');
      var data_dir = './test/data';
      fs.readdir(data_dir, function(err, files) {
        if(err) {
          console.log(err);
          return;
        }
        files.forEach(function(filename) {
          var relative_path = path.join(data_dir, filename);
          fs.lstat(relative_path, function(err, stat) {
            if(err) {
              console.log(err);
              return;
            }
            if(stat.isFile() && path.extname(relative_path) === '.js')  {
              console.log("finally we got the list of state files!!");
            }
          });
        });
      });
    });
  });
});
