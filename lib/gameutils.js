var db = require('./db.js');
var Game = require('../models/Game.js').Model;

var makeStruct = require('../structs/factory.js').makeStruct;
var ShortSummary = makeStruct("id opponentName");

function _getOpponent(player, game) {
  var opponents = game.players;
  opponents.splice(opponents.indexOf(player), 1);
  return opponents[0];
}

function getShortSummaries(player, callback) {
  Game.find({players: player}).exec(function(err, games){
    if(!err) {
      games.forEach(function(game){ 
        var shortGame = new ShortSummary();
        shortGame.id = game.id;
        var opponent = _getOpponent(player, game);
        db.mongoStore.get(opponent, function(err, session) {
          if(!err) {
            shortGame.opponentName = session.playerName;
            callback(null, shortGame);
          } else {
            callback(err, {});
          }
        });
      });
    } else {
      callback(err, {});
    }
  });
}


module.exports = {
  getShortSummaries : getShortSummaries 
};
