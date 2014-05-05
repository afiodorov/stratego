var db = require('../lib/db');
var makeStruct = require('../public/js/lib/structFactory.js');
var Chat = require('../models/Chat.js');
var ChatStruct = makeStruct('gameId player message playerName');
var logger = require('../lib/logger');
var events = require('../public/js/events.js');
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
     var chatMessage = new events.ChatMessageFromServer(chat.toObject());
     if (chatMessage.isValid) {
       io.of('/lobby').in(chat.gameId).emit('addChatMessage', chatMessage.json);
     } else {
       logger.log('warn', 'invalid chat message');
     }
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

function registerHandlers() {
  var self = this;
  self.socket.on('addChatMessage', addChatMessage.bind(self));
  self.socket.on('requestChatLog', requestChatLog.bind(self));
}

module.exports = {
  registerHandlers: registerHandlers
};
