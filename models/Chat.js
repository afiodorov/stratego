var db = require('../lib/db.js');
var ChatSchema = new db.Schema({
    gameid: {type: String},
    player: {type: String},
    message: {type: String},
    date: {type: Date},
    playerName: {type: String}
});

var Chat = db.mongoose.model('Chat', ChatSchema);

function pushMessage(chatStruct, callback) {
  var instance = new Chat();
  instance.date = new Date();
  instance.gameid = chatStruct.gameid;
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

function getMessages(gameid, limit, callback) {
  Chat.find({gameid: gameid})
    .sort('_id', 'descending').limit(limit).exec(callback);
}

function removeMessages(gameid, callback) {
  Chat.find({gameid: gameid}).remove().exec(callback);
}

module.exports = {
  Model: Chat,
  getMessages: getMessages,
  pushMessage: pushMessage,
  removeMessages: removeMessages
};
