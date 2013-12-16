var clients = Object.create(null)
  , db = require('./db.js')
  , lobbyutils = require('./lobbyutils.js')
  , Game = require('../models/Game.js');

var io;

function setio(io_in) {
  io = io_in;
}

function main(err, socket, session) {
  socket.sid = session.id;

  var onlineClients = io.sockets.clients();
  var isDuplicate = false;
  onlineClients.forEach(function(client) {
    if ((client.id !== socket.id) && client.sid === socket.sid) {
      // TODO handle this gracefully
      // break the loop as well for efficiency!
      isDuplicate = true;
      console.log("duplicate client");
    }
  });

  if(!isDuplicate) {
  if((session.playerName === undefined) ||
        // check for duplicate name in the db of sessions
        ((session.playerName in clients) 
       && (socket.sid !== clients[session.playerName].sid))) {
    session.playerName = lobbyutils.genUniquePlayerName(clients);
    session.save();
  }
  
  clients[session.playerName] = {socket: socket, sid: socket.sid};
  socket.broadcast.emit('addNewPlayer', {playerName: session.playerName,
    isSelf: false});

  onlineClients.forEach(function(client) {
    var isSelf = (client.sid === socket.sid);
    db.mongoStore.get(client.sid, function(err, session) {
      socket.emit('addNewPlayer', {playerName:
      session.playerName, isSelf: isSelf});
    });
  });

  socket.on('setPlayerName', function(data) {
    if(data.playerName in clients) {
      socket.emit('fChangedPlayerName');  
    } else {
      delete clients[session.playerName];
      socket.broadcast.emit('removePlayerName', {playerName:
        session.playerName, isSelf: false});
      socket.emit('removePlayerName', {playerName:
        session.playerName, isSelf: true});

      session.playerName = data.playerName;
      session.save();
      clients[session.playerName] = {socket: socket, sid: socket.sid};
      socket.broadcast.emit('addNewPlayer', {playerName: session.playerName, 
          isSelf: false});
      socket.emit('addNewPlayer', {playerName:
        session.playerName, isSelf: true});
    }
  });

  socket.on('requestGame', function(data) {
    try {  
      var opponent = clients[data.playerName];
      opponent.socket.emit('requestGame', {playerName:
        session.playerName});
      if (session.invites === undefined) {
        session.invites = [];
      }
      // I am inviting the opponent to the game
      session.invites.pushIfNotExist(opponent.sid);
      session.save();
    } catch(e) {
      console.log(e);
    }
  });
  
  socket.on('acceptGame', function(data){
    var opponent = clients[data.playerName];
    db.mongoStore.get(opponent.sid, function (err, opsession) {
                  if (opsession.invites.indexOf(socket.sid) !== -1) {
      // I was invited by the opponent to this game!
      Game.addPlayers(opponent.sid, socket.sid, function(err, game) {
        opponent.socket.join(game.id);
        socket.join(game.id);
        // io.sockets.in(game.id).emit('gameJoined');
        socket.emit('gameStarted', {playerName: opsession.playerName});
        opponent.socket.emit('gameStarted',
          {playerName: session.playerName});
      });
     }
         });
  });

  socket.on('disconnect', function(socket) {
    io.sockets.emit('removePlayerName', {playerName:
      session.playerName, isSelf: false});
  });

  }
}

module.exports = {
  main : main,
  setio : setio
}
