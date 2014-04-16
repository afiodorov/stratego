///*global describe, it*/
//'use strict';
//var assert = require('assert');
//var _ = require('../../public/js/lib/underscore.js');
//var logic = require('../../public/js/game/logic.js');
//var fs = require('fs');

//describe('GameLogic', function() {
//  describe('#startingPositions', function() {
//    // console.log(logic.generatePiecePositions());
//  });

//  describe('correct start positions', function() {
//    var positions = logic._startingPositions;
//    it('#_startingPositions', function() {
//      assert.deepEqual(positions.light,
//       [[0, 0],
//        [0, 0],
//        [0, 0],
//        [0, 0],
//        [1, 0],
//        [1, 1],
//        [2, 0],
//        [2, 1],
//        [2, 2]]);
//      assert.deepEqual(positions.dark,
//       [[6, 0],
//        [6, 0],
//        [6, 0],
//        [6, 0],
//        [4, 0],
//        [4, 1],
//        [4, 2],
//        [5, 0],
//        [5, 1]]);
//    });
//  });

//  describe('correctPieceSide', function() {
//    it('#getPieceSide', function() {
//      assert.equal(logic.getPieceSide('gandalf'), 'light');
//      assert.equal(logic.getPieceSide('aragorn'), 'light');
//      assert.equal(logic.getPieceSide('boromir'), 'light');
//      assert.equal(logic.getPieceSide('frodo'  ), 'light');
//      assert.equal(logic.getPieceSide('gimly'  ), 'light');
//      assert.equal(logic.getPieceSide('legolas'), 'light');
//      assert.equal(logic.getPieceSide('merry'  ), 'light');
//      assert.equal(logic.getPieceSide('pippin' ), 'light');
//      assert.equal(logic.getPieceSide('sam'    ), 'light');
//      assert.equal(logic.getPieceSide('orcs'         ), 'dark');
//      assert.equal(logic.getPieceSide('shelob'       ), 'dark');
//      assert.equal(logic.getPieceSide('saruman'      ), 'dark');
//      assert.equal(logic.getPieceSide('flying nazgul'), 'dark'); 
//      assert.equal(logic.getPieceSide('barlog'       ), 'dark');
//      assert.equal(logic.getPieceSide('warg'         ), 'dark');
//      assert.equal(logic.getPieceSide('black rider'  ), 'dark');
//      assert.equal(logic.getPieceSide('witch king'   ), 'dark');
//      assert.equal(logic.getPieceSide('cave troll'   ), 'dark');
//    });

//    it('#getValidMoveTiles', function() {
//      var path = require('path');
//      var data_dir = './test/data';
//      fs.readdir(data_dir, function(err, files) {
//        if(err) {
//          console.log(err);
//          return;
//        }
//        files.forEach(function(filename) {
//          var relative_path = path.join(data_dir, filename);
//          fs.lstat(relative_path, function(err, stat) {
//            if(err) {
//              console.log(err);
//              return;
//            }
//            if(stat.isFile() && path.extname(relative_path) === '.js')  {
//              console.log("finally we got the list of state files!!");
//            }
//          });
//        });
//      });
//    });
//  });
//});
