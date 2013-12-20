var clients = Object.create(null)
  , db = require('./db.js')
  , lobbyutils = require('./lobbyutils.js')
  , makeStruct = require('../structs/factory.js').makeStruct
  , Client = makeStruct("socket sid")
  , Game = require('../models/Game.js');

function connect(s, err) {
  if(err) {
    console.log(err);
    return;
  }

  var socket = s.socket
    , session = s.session
    , io = s.io;
  socket.sid = session.id;
  socket.session = session;

  var onlineClients = io.sockets.clients();
  var isDuplicateTab = false;
  onlineClients.forEach(function(client) {
    if ((client.id !== socket.id) && client.sid === socket.sid) {
      // TODO handle this gracefully
      // break the loop as well for efficiency!
      isDuplicateTab = true;
    }
  });

  if(isDuplicateTab) {
    return;
  }

  if((session.playerName === undefined) ||
        // check for duplicate name in the db of sessions
        ((session.playerName in clients) 
       && (socket.sid !== clients[session.playerName].sid))) {
    session.playerName = lobbyutils.genUniquePlayerName(clients);
    session.save();
  }
  
  clients[session.playerName] = new Client(socket, session.id);
  socket.broadcast.emit('addNewPlayer', {playerName: session.playerName,
    isSelf: false});

  Game.getShortGames(socket.sid, function(err, games){
    if(!err) {
      //socket.emit('listOfGames', games);
      socket.emit('listOfGames', games);
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
}

function disconnect(s) {
    s.io.sockets.emit('removePlayerName', 
    {playerName: s.session.playerName, isSelf: false});
}

function setPlayerName(s, data) {
  var socket = s.socket
    , session = s.session;

    if(data.playerName in clients) {
      socket.emit('failChangingName');  
    } else {
      delete clients[session.playerName];
      socket.broadcast.emit('removePlayerName', {playerName:
        session.playerName, isSelf: false});
      socket.emit('removePlayerName', {playerName:
        session.playerName, isSelf: true});

      session.playerName = data.playerName;
      session.save();
      clients[session.playerName] = new Client(socket, socket.sid);
      socket.broadcast.emit('addNewPlayer', {playerName: session.playerName, 
          isSelf: false});
      socket.emit('addNewPlayer', {playerName:
        session.playerName, isSelf: true});
    }
}

function requestGame(s, data) {
  var socket = s.socket
    , session = s.session;

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
}

function acceptGame(s, data){
  var socket = s.socket
    , session = s.session;

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
  }

function main(s, err) {
  connect(s, err);
  var socket = s.socket;

  socket.on('setPlayerName', function(data) {setPlayerName(s, data);});
  socket.on('requestGame', function(data) { requestGame(s, data); });
  socket.on('acceptGame', function(data){acceptGame(s, data);});
  socket.on('disconnect', function() {disconnect(s);});
}

module.exports = {
  main : main,
};
