/*global Enumerable*/
'use strict';
var gameStructs = require("./structs.js");
var _ = require('../lib/underscore.js');
var allowedSides = ['light', 'dark'];
var events = require("./../events.js");

/* Returns an object of the starting positions
 * For a standard board will return:
 * { light:
 *     [[1, 1],
 *      [1, 1],
 *      [1, 1],
 *      [1, 1],
 *      [2, 1],
 *      [2, 2],
 *      [3, 1],
 *      [3, 2],
 *      [3, 3]],
 *   dark:
 *     [[7, 1],
 *      [7, 1],
 *      [7, 1],
 *      [7, 1],
 *      [5, 1],
 *      [5, 2],
 *      [5, 3],
 *      [6, 1],
 *      [6, 2]]
 * }
 */

var getPieceSide = function(piece) {
  if(_.keys(gameStructs.pieces.dark).indexOf(piece) !== -1) {
    return 'dark';
  }

  if(_.keys(gameStructs.pieces.light).indexOf(piece) !== -1) {
    return 'light';
  }

  return null;
};

var _startingPositions =  {
  light: _.times(4, _.constant([1,1]))
    .concat(
       gameStructs.tiles.filter(
         function(tile) {
           return tile.index[0] === 2 || tile.index[0] === 3;
         }).map(
         function(tile) {return tile.index;})),
  dark: _.times(4, _.constant([gameStructs.tiles.numRows,1]))
    .concat(
       gameStructs.tiles.filter(
         function(tile) {return tile.index[0] === gameStructs.tiles.numRows - 1
           || tile.index[0] === gameStructs.tiles.numRows - 2;})
       .map(
         function(tile) {return tile.index;})
       )
};

/** Random position for a dark/light side 
 * used in initialising a game state */
var generateStartPosition = function(side) {
  var pieces = gameStructs.pieces[side];
  return _.zip(
      _.keys(pieces),
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
  var moves = gameStructs.tiles[pieceLocation].getForwardTiles();
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
  return gameStructs.tiles[pieceLocation].getBackwardTiles();
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
      var sideTiles = gameStructs.tiles[pieceLocation].getReachableSideTiles();
      var backTiles = gameStructs.tiles[pieceLocation].getBackwardTiles();
      var attackTiles = _.union(sideTiles, backTiles).filter(stateHolder.isTileWithEnemy);
      return _.union(attackTiles, moves);
    case 'flying nazgul':
      var attackTiles = stateHolder.getOppTiles().filter(function(tile) {
        return stateHolder.oppPiecesCount(tile) === 1;
      });
      return _.union(attackTiles, moves);
    case 'witch king':
      var attackTiles = gameStructs.tiles[pieceLocation].getReachableSideTiles().filter(stateHolder.isTileWithEnemy);
      return _.union(attackTiles, moves);
    case 'black rider':
      var attackTiles = new Array(0);
      preorder(attackTiles, gameStructs.tiles[pieceLocation],
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

/* autocompletion now works */
if(false) {
  var StateHolder = require('./stateHolder.js');
  var stateHolder = new StateHolder();
  var moveEvent = new events.Move();
  isAttack(stateHolder, moveEvent);
  isMoveValid(stateHolder, moveEvent);
  getValidMoveTiles(stateHolder, moveEvent.piece);
}
