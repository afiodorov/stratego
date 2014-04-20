'use strict';
var tiles = require("./structs.js").tiles;
var pieces = require("./structs.js").pieces;
var side = require('./structs/side.js');
var Position = require('./structs/position.js');

var _ = require('../lib/underscore.js');
var events = require("./../events.js");

var _startingPositions;

_startingPositions[side.LIGHT] = _.times(4, new Position(0, 0)).concat(
        _.union(tiles[1], tiles[2]).map(
        _.pick.bind(null, 'position')));

_startingPositions[side.DARK] = (function() {
  var numRows = tiles.length;
  return _.times(4, new Position(numRows - 1, 0)).concat(
    _.union(tiles[numRows - 2], tiles[numRows - 3]).map(
    _.pick.bind(null, 'position'))
  );
}());

/** Random position for a dark/light side 
 * used in initialising a game state */
var generateStartPosition = function(side) {
  var sidePieces = pieces[side];
  return _.zip(
      _.keys(sidePieces),
      _.shuffle(_startingPositions[side])
      ).map(_.object.bind(null, ['name', 'position']));
};

var hasRequiredFields = function(o, requiredFields) {
  return requiredFields.reduce(function(res, prop) {
    return res && o.hasOwnProperty(prop);
  }, true);
};

var isGameStateValid = function(stateHolder) {
  var requiredFields = ['pieces', 'cards'];
  return hasRequiredFields(stateHolder, ['stage', 'mySide', 'turn'])
    && hasRequiredFields(stateHolder.light, requiredFields) 
    && hasRequiredFields(stateHolder.dark, requiredFields);
};

var isSideValid = function(side) {
  return allowedSides.indexOf(side) !== -1;
};

/* returns dark if input is light and light if input is dark */
var getOppSide = function(side) {
  if(side === 'light') {
    return 'dark';
  } 

  if(side === 'dark') {
    return 'light';
  }

  throw new TypeError("Can't get opposite side");
};

/* Returns 'light' or 'dark' at random */
var generateRandomSide = function() {
  return _.sample(allowedSides);
};

var isAttack = function(stateHolder, moveEvent) {
  return stateHolder.isTileWithEnemy(moveEvent.toTile);
};

var isMyTurn = function(mySide, stateHolder) {
  if(stateHolder.stage === 'start' || 'game' || 'battle') {
    if(mySide !== stateHolder.turn) {
      return false;
    }
  }

  return true;
};

var getStandardLightMoves = function(pieceLocation) {
  var moves = tiles[pieceLocation].getForwardTiles();
  // no switch on reference types => convert [1,1] to '1 1'
  switch(pieceLocation.join(' ')) {
    case '3 2':
    case '5 1':
      moves.push([5,2]);
    break;
    case '5 2':
      moves.push([5,3]);
    break;
  }
  return moves;
};

var getStandardDarkMoves = function(pieceLocation) {
  return tiles[pieceLocation].getBackwardTiles();
};

var getStandardMoves = function(side, pieceLocation) {
  return (side === 'light') ? getStandardLightMoves(pieceLocation) :
    getStandardDarkMoves(pieceLocation);
};

var getValidMoveTiles = function(stateHolder, piece) {
  var pieceLocation = stateHolder.getPieceLocation(piece);
  var moves = getStandardMoves(getPieceSide(piece),
      pieceLocation).filter(function(tile) {
    return !stateHolder.isTileFull(tile);
  });

  switch(piece) {
    case 'aragorn':
      var sideTiles = tiles[pieceLocation].getReachableSideTiles();
      var backTiles = tiles[pieceLocation].getBackwardTiles();
      var attackTiles = _.union(sideTiles, backTiles).filter(stateHolder.isTileWithEnemy);
      return _.union(attackTiles, moves);
    case 'flying nazgul':
      var attackTiles = stateHolder.getOppTiles().filter(function(tile) {
        return stateHolder.oppPiecesCount(tile) === 1;
      });
      return _.union(attackTiles, moves);
    case 'witch king':
      var attackTiles = tiles[pieceLocation].getReachableSideTiles().filter(stateHolder.isTileWithEnemy);
      return _.union(attackTiles, moves);
    case 'black rider':
      var attackTiles = new Array(0);
      preorder(attackTiles, tiles[pieceLocation],
        function(tile){return !stateHolder.isTileWithEnemy;});
      return _.union(attackTiles, moves);
  }

  return moves;
};

var preorder = function(acc, tile, predicate) {
  if(!tile) return;
  if(predicate(tile)) {
    acc = _.union(acc, [tile.index]);
    tile.getForwardTiless().forEach(function(tile) {
      preorder(acc, tile, predicate);
    });
  }
}

var isMoveValid = function(stateHolder, moveEvent) {
  if(!moveEvent.isValid) {
    return false;
  }

  var pieceLocation = stateHolder.getPieceLocation(moveEvent.piece);
  if(!pieceLocation) {
    return false;
  }

  if(!isMyTurn(moveEvent.side, stateHolder)) {
    return false;
  }

  var validMoves = getValidMoveTiles(stateHolder, moveEvent);
  if(validMoves.indexOf(moveEvent.toTile) === -1) {
    return false;
  }

  return true;
};

module.exports = {
  isMoveValid : isMoveValid,
  getOppSide : getOppSide,
  generateRandomSide : generateRandomSide,
  generateStartPosition : generateStartPosition,
  isSideValid : isSideValid,
  getPieceSide : getPieceSide,
  getValidMoveTiles : getValidMoveTiles,
  _startingPositions : _startingPositions
};
