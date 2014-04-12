#!/usr/bin/node
var logic = require('../public/js/game/logic.js');
var tiles = require('../public/js/game/structs.js').tiles;
var pieces = require('../public/js/game/structs.js').pieces;
var _ = require('../public/js/lib/underscore.js');

var allIndices = [];
tiles.forEach(function(tile) {
  _.range(tile.capacity).forEach(function() {
    allIndices.push(tile.index);
  });
});

var GameState = function() {};
var genRandomState = function() {
  var gameState = new GameState();

  var mySide = logic.generateRandomSide();
  var oppSide = logic.getOppSide(mySide);

  var numPieces = _.random(1, _.keys(pieces[mySide]).length);
  var occupiedPiecesByMySide = _.sample(allIndices, numPieces);
  var mySidePieces = _.zip(
      _.sample(_.keys(pieces[mySide]), numPieces),
      occupiedPiecesByMySide
      ).map(_.object.bind(null, ['name', 'position']));

  var leftTiles = _.difference(allIndices, occupiedPiecesByMySide);
  var numOppPieces = _.random(1, _.keys(pieces[oppSide]).length);
  var oppPieces = _.sample(leftTiles, numOppPieces).map(
    function(tile) {return {position: tile};});

  gameState.mySide = mySide;
  gameState.stage = 'move';
  gameState.turn = logic.generateRandomSide();
  gameState[mySide] = {};
  gameState[mySide].pieces = mySidePieces;
  gameState[oppSide] = {};
  gameState[oppSide].pieces = oppPieces;

  return gameState;
};

var isValid = function(state) {
  var lastIndex = tiles.numRows + ' ' + tiles.numCols(tiles.numRows);
  if (_.find(state.light.pieces, function(piece) {
    return piece.name === 'frodo' && 
      piece.position.join(' ') === lastIndex;})) {
    return false;
  }
  return true;
};

var state = genRandomState();
while(!isValid(state)) {
  state = genRandomState();
}

console.log(JSON.stringify(state, null, 1));
