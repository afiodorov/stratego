/*global Enumerable*/
'use strict';
var gameStructs = require("./structs.js");
var _ = require('../lib/underscore.js');
var allowedSides = ['light', 'dark'];

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

/* Random position for a dark/light side 
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
var getOppositeSide = function(side) {
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

var isMoveObjectValid = function(move) {
  if(!hasRequiredFields(move, ["piece", "side", "toTile"])) {
    return false;
  }

  if(!isSideValid(move.side)) {
    return false;
  }

  if(!gameStructs.pieces[move.side][move.piece]) {
    return false;
  }

  if(!gameStructs.isWithinGrid(move.toTile)) {
    return false;
  }
};

var isAttack = function(stateHolder, move) {
  return stateHolder.isTileWithEnemy(move.toTile);
};

var getPieceLocation = function(stateHolder, side, piece) {
  var pieceLocArr =
    Enumerable.From(stateHolder[side].piecesLeft).Where(
    function(x) {return x.name === piece;}).Select(
    function(x) {return x.position;}).Take(1).toArray();
    if(pieceLocArr.length === 0) {
      return -1;
    }
  return pieceLocArr[0];
};

var isMoveValid = function(stateHolder, move) {
  /* 
   * move {piece, side, toTile}
  */

  var newState = null;

  if(!isGameStateValid(stateHolder)) {
    return {err: "Invalid gaming state passed"};
  }

  if(!isMoveObjectValid(move)) {
    return {err: "Invalid move passed"};
  }

  if(stateHolder.stage === "start" || "game") {
    if(move.side !== stateHolder.turn) {
      return {err: "Not your turn"};
    }
  }

  var pieceLocation = getPieceLocation(stateHolder, move.side, move.piece);
  if(pieceLocation === -1) {
    return {err: "You don't have that piece"};
  }

  return {
    newState : newState
  };
};

module.exports = {
  isMoveValid : isMoveValid,
  getOppositeSide : getOppositeSide,
  generateRandomSide : generateRandomSide,
  generateStartPosition : generateStartPosition,
  _startingPositions : _startingPositions
};

/* autocompletion now works */
if(false) {
  var StateHolder = require('./stateHolder.js');
  var stateHolder = new StateHolder();
  isAttack(stateHolder, {piece: 'gandalf', side: 'light', toTile: [1,1]});
  isMoveValid(stateHolder, {piece: 'gandalf', side: 'light', toTile: [1,1]});
}
