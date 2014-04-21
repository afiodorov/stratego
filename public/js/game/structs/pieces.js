'use strict';
var _ = require('../../lib/underscore.js');
var side = require('./side.js');

var pieces = {};
var makePiece = require('./piece.js');

var addPiece = function (name, desc, str, side) {
  var piece = makePiece.apply(null, arguments);
  pieces[name] = piece;
};

addPiece('gandalf',
  'Dark Player must play his card first', 5, side.LIGHT);
addPiece('aragorn',
  'May attack any adjacent region', 4, side.LIGHT);
addPiece('boromir',
  'Both Boromir and Enemy character are instantly defeated', 0, side.LIGHT);
addPiece('frodo',
  'When attacked, may retreat sideways', 1, side.LIGHT);
addPiece('gimly',
  'Instantly defeats the Orcs', 3, side.LIGHT);
addPiece('legolas',
  'Instantly defeats the Flying Nazgul', 3, side.LIGHT);
addPiece('merry',
  'Instantly defeats the Witch King', 2, side.LIGHT);
addPiece('pippin',
  'When attacking may retreat backwards', 1, side.LIGHT);
addPiece('sam',
  'When with Frodo, is Strength 4 & may replace Frodo in battle',
  2, side.LIGHT);

addPiece('orcs',
  'When attacking instantly defeats the first character', 2, side.DARK);
addPiece('shelob',
  'After Shelob defeats an Enemy character' +
  ', she is immediately returned to Gondor', 5, side.DARK);
addPiece('saruman',
  'May decide that no cards are played', 4, side.DARK);
addPiece('flying nazgul',
  'May attack a single Light character anywhere on the board', 3, side.DARK);
addPiece('barlog',
  'When in Moria instantly defeats' +
  'any Character using the Tunnel', 5, side.DARK);
addPiece('warg',
  'Enemy character\'s text is ignored', 2, side.DARK);
addPiece('black rider',
  'May move forward any number of regions to attack', 4, side.DARK);
addPiece('witch king',
  'May attack sideways', 5, side.DARK);
addPiece('cave troll',
  'The Dark Player\'s card has no value or effect', 9, side.DARK);

(function defineSideKeys() {
  _.values(side).forEach(function(side) {
    Object.defineProperty(pieces, side, {
      enumerable: false,
      value: _.values(pieces).filter(function(piece) {return piece.side === side;})
    });
  });
}());

Object.freeze(pieces);
module.exports = pieces;
