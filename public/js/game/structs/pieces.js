'use strict';
var _ = require('lodash');
var side = require('./side.js');

var pieces = {};
var makePiece = require('./piece.js');

var addPiece = function (name, desc, str, side) {
  var piece = makePiece(name, desc, str, side);
  pieces[name] = piece;
};

addPiece('Gandalf',
  'Dark Player\nmust play\nhis card first', 5, side.LIGHT);
addPiece('Aragorn',
  'May attack\nany adjacent\nregion', 4, side.LIGHT);
addPiece('Boromir',
  'Both Boromir\nand Enemy are\ninstantly defeated', 0, side.LIGHT);
addPiece('Frodo',
  'When attacked,\nmay retreat\nsideways', 1, side.LIGHT);
addPiece('Gimly',
  'Instantly defeats\nthe Orcs', 3, side.LIGHT);
addPiece('Legolas',
  'Instantly defeats\nthe Flying Nazgul', 3, side.LIGHT);
addPiece('Merry',
  'Instantly defeats\n the Witch King', 2, side.LIGHT);
addPiece('Pippin',
  'When attacking\nmay retreat\nbackwards', 1, side.LIGHT);
addPiece('Sam',
  'If with Frodo, is\n4 & may replace\nhim in battle',
  2, side.LIGHT);

addPiece('Orcs',
  'When attacking\ninstantly defeats\nthe first character', 2, side.DARK);
addPiece('Shelob',
  'After Shelob\nwins, ' +
  'she\nreturns to Gondor', 5, side.DARK);
addPiece('Saruman',
  'May decide that\nno cards\nare played', 4, side.DARK);
addPiece('Flying Nazgul',
  'May attack a\nsingle character\nanywhere', 3, side.DARK);
addPiece('Barlog',
  'If in Moria\ndefeats anyone\n' +
  'using the Tunnel', 5, side.DARK);
addPiece('Warg',
  'Enemy\ncharacter\'s\ntext is ignored', 2, side.DARK);
addPiece('Black Rider',
  'Moves forward\nanywhere\nto attack', 4, side.DARK);
addPiece('Witch King',
  'May attack\nsideways', 5, side.DARK);
addPiece('Cave Troll',
  'Dark Player\'s\ncard has no\nvalue or effect', 9, side.DARK);

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
