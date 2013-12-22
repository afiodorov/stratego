var db = require('./db.js');
var makeStruct = require('../structs/factory.js').makeStruct;
var Chat = require('../models/Chat.js').Chat;
var ChatStruct = makeStruct("game player message");

function addChatMessage(data) {
  var chat = new ChatStruct(data.game, this.socket.sid, data.message);
  Chat.pushMessage(chat, function(err, chat) {
   if(err) {
    console.log("couldn't push chat message");
   } else {
     this.io.sockets.in(chat.game).emit('addChatMessage', chat);
   }
  });
}

function main() {
  var self = this;
  self.socket.on('addChatMessage', addChatMessage.bind(self)) 
}
