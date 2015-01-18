var db = require('../lib/db.js');
var ChatSchema = new db.Schema({
    gameId: {type: String},
    player: {type: String},
    message: {type: String},
    date: {type: Date},
    playerName: {type: String}
});

var Chat = db.mongoose.model('Chat', ChatSchema);

function pushMessage(chatStruct, callback) {
  var instance = new Chat();
  instance.date = new Date();
  instance.gameId = chatStruct.gameId;
  instance.player = chatStruct.player;
  instance.message = chatStruct.message;
  instance.playerName = chatStruct.playerName;

  instance.save(function(err) {
    if (err) {
      callback(err);
    } else {
      callback(null, instance);
    }
  });
}

function getMessages(gameId, limit, callback) {
  Chat.find({gameId: gameId})
    .sort({'_id': 'descending'}).limit(limit).exec(callback);
}

function removeMessages(gameId, callback) {
  Chat.find({gameId: gameId}).remove().exec(callback);
}

module.exports = {
  Model: Chat,
  getMessages: getMessages,
  pushMessage: pushMessage,
  removeMessages: removeMessages
};
