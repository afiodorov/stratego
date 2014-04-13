'use strict';

var tiles = (function () {
  var makeTile = require('./tile.js');
  var _ = require("../../lib/underscore.js");
  var tilesArr = [];
  _.range(7).forEach(function (i) { tilesArr[i] = []; });

  var addTile = function (name, cap, xpos, ypos) {
    tilesArr[ypos][xpos] = makeTile(name, cap, { x: xpos, y: ypos });
  }
  addTile('The Shire', 4, 0, 0);
  addTile('Arthedam', 2, 0, 1);
  addTile('Cardolan', 2, 1, 1);
  addTile('Rhudaur', 2, 0, 2);
  addTile('Eregion', 2, 1, 2);
  addTile('Enedwaith', 2, 2, 2);
  addTile('The High Pass', 1, 0, 3);
  addTile('Misty Mountains', 1, 1, 3);
  addTile('Caradoras', 1, 2, 3);
  addTile('Gap Of Rohan', 1, 3, 3);
  addTile('Mirkwood', 2, 0, 4);
  addTile('Fangorn', 2, 1, 4);
  addTile('Rohan', 2, 2, 4);
  addTile('Gondor', 2, 0, 5);
  addTile('Dagorlad', 2, 1, 5);
  addTile('Mordor', 4, 0, 6);
  return tilesArr;
})();

module.exports = tiles;
