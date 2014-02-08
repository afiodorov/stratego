var db = require('../../lib/db.js');
var Game = require('../Game.js').Model;

var makeStruct = require('../../lib/structFactory.js').makeStruct;
var ShortSummary = makeStruct("id opponentName");

function _getOpponent(player, game) {
  var opponents = game.players.slice(0);
  opponents.splice(opponents.indexOf(player), 1);
  return opponents[0];
}

function getShortSummary(game, player, callback) {
  var shortGame = new ShortSummary();
  shortGame.id = game.id;
  var opponent = _getOpponent(player, game);
  db.mongoStore.get(opponent, function(err, session) {
    if(!err) {
      shortGame.opponentName = session.playerName;
      callback(null, shortGame);
    } else {
      callback(err, null);
    }
  });
}

function getShortSummaries(player, callback) {
  Game.find({players: player}).exec(function(err, games){
    if(!err) {
      games.forEach(function(game){ 
        getShortSummary(game, player, callback);
      });
    } else {
      callback(err, {});
    }
  });
}

module.exports = {
  getShortSummary : getShortSummary,
  getShortSummaries : getShortSummaries
};
