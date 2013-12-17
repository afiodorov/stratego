var clients = Object.create(null)
  , db = require('./db.js')
  , lobbyutils = require('./lobbyutils.js')
  , Game = require('../models/Game.js');

function setPlayerName(s, data) {
  var socket = s.socket
    , session = s.session;

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
}

function main(s, err) {
  var socket = s.socket
    , session = s.session
    , io = s.io;
  if(err) {
    console.log(err);
    return;
  }

  socket.sid = session.id;
  socket.session = session;

  var onlineClients = io.sockets.clients();
  var isDuplicate = false;
  onlineClients.forEach(function(client) {
    if ((client.id !== socket.id) && client.sid === socket.sid) {
      // TODO handle this gracefully
      // break the loop as well for efficiency!
      isDuplicate = true;
    }
  });

  if(isDuplicate) {
    return;
  }

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

  Game.getInstances(socket.sid, function(err, games){
    if(!err) {
    } else {
      console.log(err);
    }
  });

  onlineClients.forEach(function(client) {
    var isSelf = (client.sid === socket.sid);
    db.mongoStore.get(client.sid, function(err, session) {
      if(!err) {
        socket.emit('addNewPlayer', {playerName:
        session.playerName, isSelf: isSelf});
      } else {
        console.log(err);
      }
    });
  });

  socket.on('setPlayerName', function(data) {setPlayerName(s, data);});
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
          if(!err) {
            opponent.socket.join(game.id);
            socket.join(game.id);
            // io.sockets.in(game.id).emit('gameJoined');
            socket.emit('gameStarted', {playerName: opsession.playerName});
            opponent.socket.emit('gameStarted',
              {playerName: session.playerName});
          } else {
            console.log(err);
          }
        });
     }
   });
  });

  socket.on('disconnect', function() {
    io.sockets.emit('removePlayerName', 
    {playerName: session.playerName, isSelf: false});
  });
}

module.exports = {
  main : main,
};
