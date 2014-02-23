var db = require('../../lib/db.js');
var Game = require('../Game.js').Model;
var Q = require('q');
var _ = require('../../public/js/lib/underscore.js');
var makeStruct = require('../../public/js/lib/structFactory.js');
var GameLogic = require('../../public/js/game/logic.js');

function _getOpponentSid(game, playerSid) {
  var opponents = game.players;
  return opponents.filter(function(playerPair) {
    return playerPair.sid !== playerSid;
  })[0].sid;
}

function _getPlayerSide(game, playerSid) {
  var opponents = game.players;
  return opponents.filter(function(playerPair) {
    return playerPair.sid === playerSid;
  })[0].side;
}

function addOpponentName(game, playerSid) {
  var opponentSid = _getOpponentSid(playerSid, game);
  var getSession = Q.nbind(db.mongoStore.get, db.mongoStore);
  return getSession(opponentSid).then(function(opSession) {
    game.opponentName = opSession.playerName;
    return Q.fcall(function() {
      return game;
    });
  });
}

function nullifyPosition(o) {
  o.position = null;
}

function removeOpponentPieces(game) {
  var opponentSide = GameLogic.getOppositeSide(game.mySide);
  game.state[opponentSide].pieces =
    game.state[opponentSide].pieces.map(nullifyPosition);
}

function addMySide(game, playerSid) {
  game.mySide = _getPlayerSide(game, playerSid);
}

function getState(game, playerSid) {
  return addOpponentName(game, playerSid).then(
    function(game) {
      addMySide(game, playerSid);
      removeOpponentPieces(game);
      game.players = null;
      return Q.fcall(function() {
        return game;
      });
    });
}

module.exports = {
  getState: getState
};
