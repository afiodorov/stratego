var db = require('../lib/db.js');
var ChatSchema = new db.Schema({
    game : {type: String},
    player : {type: String},
    message : {type: String},
    date : {type: Date}
});

var Chat = db.mongoose.model('Chat', ChatSchema);

function pushMessage(chatStruct, callback) {
  var instance = new Chat();
  instance.date = new Date();
  instance.game = chatStruct.game;
  instance.player = chatStruct.player;
  instance.message = chatStruct.message;

  instance.save(function (err) {
    if (err) {
      callback(err);
    } else {
      callback(null, instance);
    }
  });
}

function getMessages(game, limit, callback) {
  Chat.find({game: game})
    .sort('_id', 'descending').limit(limit).exec(callback);
}

module.exports = {
  Chat : Chat,
  pushMessage : pushMessage
};
