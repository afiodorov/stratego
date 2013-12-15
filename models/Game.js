var db = require('../lib/db');

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
    }
    else {
      callback(null, instance);
    }
  });
}

function getInstance(player1, player2, callback) {
	Game.findOne({players: [player1, player2].sort()}).exec(callback);
}

module.exports = {
  addPlayers : addPlayers,
  find: function(callback) {
    Game.find().sort('_id', 'descending').limit(5).exec(callback);
  },
  getInstance : getInstance,
};
