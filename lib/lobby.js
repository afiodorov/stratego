var clients = Object.create(null)
  , db = require('./db.js')
  , lobbyutils = require('./lobbyutils.js')
  , makeStruct = require('../structs/factory.js').makeStruct
  , Client = makeStruct("socket sid")
  , Game = require('../models/Game.js')
  , gameutils = require('../models/utils/gameutils.js');

var logger = require('./logger');

function connect() {
  var socket = this.socket
    , session = this.session
    , io = this.io;
  socket.sid = session.id;
  socket.session = session;

  var onlineClients = io.of('/lobby').clients();
  _joinRooms.call(this);
  _checkForDuplicateSession.call(this, onlineClients);
  _setSocketPlayerName.call(this, clients);
  _sendListOfGames.call(this);
  _sendListOfPlayers.call(this, onlineClients);

  clients[session.playerName] = new Client(socket, session.id);
  
  socket.broadcast.emit('addNewPlayer', {playerName:
  session.playerName, isSelf: false});
}

function disconnect() {
    this.io.of('/lobby').emit('removePlayerName', 
    {playerName: this.session.playerName, isSelf: false});
}

function resignGame(game) {
  this.io.of('/lobby').in(game.id).emit('removeGame', game);
  this.socket.broadcast.to(game.id).emit('opponentResigned', this.session.playerName);
  Game.resignPlayer(this.session.id, game, function(err) {
    if(err) {
      logger.log(err);
    }
  });
}

function setPlayerName(data) {
  var socket = this.socket
    , session = this.session;

    if(!data.hasOwnProperty('playerName')) {
      socket.emit('failChangingName', 'No player name provided');  
      return;
    }

    if(data.playerName in clients) {
      socket.emit('failChangingName', 'Duplicate player name');  
      return;
    }

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
      logger.log('warn', "can't fetch the game");
      logger.log('warn', e);
    }
}

function acceptGame(data){
  var socket = this.socket
    , session = this.session
    , self = this;

    var opponent = clients[data.playerName];
    db.mongoStore.get(opponent.sid, function (err, opsession) {
      if(err) {
        logger.log('warn', "failed to fetch the opponent from db");
        logger.log('warn', err);
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
          logger.log('warn', "couldn't update about new game");
          logger.log('warn', err);
        }
      });

      gameutils.getShortSummary(game, opponent.sid, function(err, game){
        if(!err) {
          opponent.socket.emit('addShortGame', game);
        } else {
          logger.log('warn', "failed to updated opponent's new game");
          logger.log('warn', err);
        }
      });
    } else {
      // couldn't add game
      logger.log('warn', "failed to add game");
      logger.log('warn', err);
    }
  });
}

function _isNewClient() {
  return (typeof this.session.playerName === "undefined");
}

function _joinRooms() {
  var socket = this.socket;
  var session = this.session;
  Game.getInstances(session.id, function(err, games) {
    if(err) {
      logger.log('error', "problem fetching games for the session");
    return;
    }

    games.forEach(function(game){
      socket.join(game.id);
    });
  });
}

function _setSocketPlayerName(clients) {
  if((this.session.playerName === undefined) ||
        // check for duplicate name in the db of sessions
        ((this.session.playerName in clients) 
       && (this.socket.sid !== clients[this.session.playerName].sid))) {
    this.session.playerName = lobbyutils.genUniquePlayerName(clients);
    this.session.save();
  }
  
}

function _checkForDuplicateSession(onlineClients) {
  var socket = this.socket;

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
}

function _sendListOfGames() {
  var socket = this.socket;
  gameutils.getShortSummaries(socket.sid, function(err, game){
    if(!err) {
      socket.emit('addShortGame', game);
    } else {
      logger.log('warn', "can't build game summary");
      logger.log('warn', err);
    }
  });
}

function _sendListOfPlayers(onlineClients) {
  var socket = this.socket;
  onlineClients.forEach(function(client) {
    var isSelf = (client.sid === socket.sid);
    db.mongoStore.get(client.sid, function(err, session) {
      if(!err) {
        socket.emit('addNewPlayer', {playerName:
        session.playerName, isSelf: isSelf});
      } else {
        logger.log('warn', "can't fetch client");
        logger.log('warn', err);
      }
    });
  });
}

function main() {
  connect.call(this);
  this.socket.on('setPlayerName', setPlayerName.bind(this));
  this.socket.on('requestGame', requestGame.bind(this));
  this.socket.on('acceptGame', acceptGame.bind(this));
  this.socket.on('resignGame', resignGame.bind(this));
  this.socket.on('disconnect', disconnect.bind(this));
}

module.exports = {
  main : main,
};
