var clients = Object.create(null)
  , db = require('./db.js')
  , lobbyutils = require('./lobbyutils.js')
  , makeStruct = require('../structs/factory.js').makeStruct
  , Client = makeStruct("socket sid")
  , Game = require('../models/Game.js')
  , gameutils = require('../models/utils/gameutils.js');

function connect(err) {
  if(err) {
    console.log("bad session");
    console.log(err);
    return;
  }

  var socket = this.socket
    , session = this.session
    , io = this.io;
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
    socket.json.emit('setShouldShowPage', {bool: false, err: "This page is already"
    + " open in one of your tabs. Please close duplicate tabs and refresh."});
    // socket.close();
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

  gameutils.getShortSummaries(socket.sid, function(err, game){
    if(!err) {
      socket.emit('addShortGame', game);
    } else {
      console.log("can't build game summary");
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
        console.log("can't fetch client");
        console.log(err);
      }
    });
  });
}

function disconnect() {
    this.io.sockets.emit('removePlayerName', 
    {playerName: this.session.playerName, isSelf: false});
}

function setPlayerName(data) {
  var socket = this.socket
    , session = this.session;

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

function requestGame(data) {
  var socket = this.socket
    , session = this.session;

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
      console.log("can't fetch the game");
      console.log(e);
    }
}

function acceptGame(data){
  var socket = this.socket
    , session = this.session
    , self = this;

    var opponent = clients[data.playerName];
    db.mongoStore.get(opponent.sid, function (err, opsession) {
      if(err) {
        console.log("failed to fetch the opponent from db");
        console.log(err);
        return;
      }

      var wasInvited = (opsession.invites.indexOf(socket.sid) !== -1);
      if (wasInvited) {
        (_addNewGame.bind(self))(opponent, opsession)
      } else {
        socket.emit('error', "The player has not invited you");
      }
   });
  }

function _addNewGame(opponent, opsession) {
  var socket = this.socket
    , session = this.session;
    
  Game.addPlayers(opponent.sid, socket.sid, function(err, game) {
    if(!err) {
      opponent.socket.join(game.id);
      socket.join(game.id);
      socket.emit('gameStarted', {playerName: opsession.playerName});
      opponent.socket.emit('gameStarted',
        {playerName: session.playerName});

      gameutils.getShortSummary(game, socket.sid, function(err, game){
        if(!err) {
          socket.emit('addShortGame', game);
        } else {
          console.log("couldn't update about new game");
          console.log(err);
        }
      });

      gameutils.getShortSummary(game, opponent.sid, function(err, game){
        if(!err) {
          opponent.socket.emit('addShortGame', game);
        } else {
          console.log("failed to updated opponent's new game");
          console.log(err);
        }
      });
    } else {
      // couldn't add game
      console.log("failed to add game");
      console.log(err);
    }
  });
}

function main(err) {
  (connect.bind(this))(err);
  this.socket.on('setPlayerName', setPlayerName.bind(this));
  this.socket.on('requestGame', requestGame.bind(this));
  this.socket.on('acceptGame', acceptGame.bind(this));
  this.socket.on('disconnect', disconnect.bind(this));
}

module.exports = {
  main : main,
};
