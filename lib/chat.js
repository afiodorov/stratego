var db = require('./db.js');
var makeStruct = require('../structs/factory.js').makeStruct;
var Chat = require('../models/Chat.js');
var ChatStruct = makeStruct("gameid player message playerName");
var logger = require('./logger');
var INITIAL_CHAT_SIZE = 20;

function addChatMessage(data) {
  var io = this.io;
  var chat = new ChatStruct(data.gameid, this.socket.sid, data.message, this.session.playerName);
  Chat.pushMessage(chat, function(err, chat) {
   if(err) {
    logger.log('error', "couldn't push chat message");
    logger.log(err);
   } else {
     io.of('/lobby').in(chat.gameid).emit('addChatMessage', chat);
   }
  });
}

function requestChatLog(game) {
  var io = this.io;
  if(!game.hasOwnProperty('id')) {
    logger.log('info', "bad chat log request");
    return;
  }

  Chat.getMessages(game.id, INITIAL_CHAT_SIZE, function(err, log) {
    if(err) {
      logger.log('error', "can't retrieve chat log for a game");
      return;
    }
    io.of('/lobby').in(game.id).emit('setChatLog', log.reverse());
  });
}

function main() {
  var self = this;
  self.socket.on('addChatMessage', addChatMessage.bind(self));
  self.socket.on('requestChatLog', requestChatLog.bind(self));
}

module.exports = {
  main: main
};
