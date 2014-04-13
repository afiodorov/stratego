var db = require('../lib/db');
var makeStruct = require('../public/js/lib/structFactory.js');
var Chat = require('../models/Chat');
var ChatStruct = makeStruct('gameId player message playerName');
var logger = require('../lib/logger');
var INITIAL_CHAT_SIZE = 20;

function addChatMessage(data) {
  var io = this.io;
  var chat = new ChatStruct(data.gameId, this.socket.sid, data.message,
      this.session.playerName);
  Chat.pushMessage(chat, function(err, chat) {
   if (err) {
    logger.log('error', 'couldn\'t push chat message');
    logger.log(err);
   } else {
     io.of('/lobby').in(chat.gameId).emit('addChatMessage', chat);
   }
  });
}

function requestChatLog(gameId) {
  var io = this.io;
  Chat.getMessages(gameId, INITIAL_CHAT_SIZE, function(err, log) {
    if (err) {
      logger.log('error', 'can\'t retrieve chat log for a game');
      return;
    }
    io.of('/lobby').in(gameId).emit('setChatLog', {log: log.reverse(), gameId: gameId});
  });
}

function main() {
  var self = this;
  self.socket.on('addChatMessage', addChatMessage.bind(self));
  self.socket.on('requestChatLog', requestChatLog.bind(self));
}

module.exports = {
  registerHandlers: main
};
