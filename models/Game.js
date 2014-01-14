var db = require('../lib/db.js');
var GameSchema = new db.Schema({
    players : [{type: String}],
});
var Game = db.mongoose.model('Game', GameSchema);

function addPlayers(player1, player2, callback) {
  var instance = new Game();
  instance.players = [player1, player2].sort();
  instance.save(function (err) {
    if (err) {
      callback(err);
    } else {
      callback(null, instance);
    }
  });
}

function getInstance(player1, player2, callback) {
	Game.findOne({players: [player1, player2].sort()}).exec(callback);
}

function getInstances(player, callback) {
  Game.find({players: player}).exec(callback);
}

function resignPlayer(player, game, callback) {
 Game.findOne({'_id': game.id, players: player}).remove().exec(callback);
}

module.exports = {
  addPlayers : addPlayers,
  find: function(callback) {
    Game.find().sort('_id', 'descending').limit(5).exec(callback);
  },
  getInstance : getInstance,
  getInstances : getInstances,
  resignPlayer: resignPlayer,
  Model : Game
};
