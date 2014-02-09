var Q = require('q');
var clients = [];
var db = require('../lib/db');
var lobbyutils = require('../lib/lobbyutils');
var makeStruct = require('../lib/structFactory').makeStruct;
var Client = makeStruct("socket sid");
var Game = require('../models/Game');
var arr = require('../public/js/arr.js');
var gameutils = require('../models/utils/gameutils');

// first one is default
var invitesAllowed = ['all', 'light', 'dark', 'none'];

var logger = require('../lib/logger');

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
  _initialisePlayer.call(this);
  _sendListOfGames.call(this);
  _sendListOfPlayers.call(this, onlineClients);

  clients[session.playerName] = new Client(socket, session.id);
  
  socket.broadcast.emit('addNewPlayer', {playerName:
  session.playerName, invitesAccepted: session.invitesAccepted, isSelf: false});
}

function disconnect() {
    this.io.of('/lobby').emit('removePlayerName', 
    {playerName: this.session.playerName, isSelf: false});
}

function resignGame(game) {
  if(!game || typeof game.id === "undefined") {
    return;
  }
  this.io.of('/lobby').in(game.id).emit('removeGame', game);
  this.socket.broadcast.to(game.id).emit('opponentResigned', this.session.playerName);
  Game.resignPlayer(this.session.id, game, function(err) {
    if(err) {
      logger.log(err);
    }
  });
  require('../models/Chat.js').removeMessages(game.id);
}

function changeMyPlayerName(playerName) {
  var socket = this.socket
    , session = this.session;

    if(!playerName) {
      socket.emit('failChangingName', 'No player name provided');  
      return;
    }

    if(clients.indexOf(playerName) !== -1) {
      socket.emit('failChangingName', 'Duplicate player name');  
      return;
    }

    delete clients[session.playerName];
    socket.broadcast.emit('removePlayerName', {playerName:
      session.playerName, isSelf: false});
    socket.emit('removePlayerName', {playerName:
      session.playerName, isSelf: true});

    session.playerName = playerName;
    session.save();
    clients[session.playerName] = new Client(socket, socket.sid);
    socket.broadcast.emit('addNewPlayer', {playerName: session.playerName, 
        isSelf: false});
    socket.emit('addNewPlayer', {playerName:
      session.playerName, isSelf: true});
}

function requestGame(data) {
    var session = this.session;

    try {
      var opponent = clients[data.playerName];
      if(!opponent) {
        return;
      }
      opponent.socket.emit('requestGame', {playerName:
        session.playerName});
      if (typeof session.invites === "undefined") {
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

function changeInvitesAccepted(invitesAccepted) {
  if(invitesAccepted && invitesAllowed.indexOf(invitesAccepted) === -1) {
    this.session.invitesAccepted = invitesAccepted;
    this.session.save();
    this.socket.emit("setInvitesAccepted", invitesAccepted);
  }
}

function acceptGame(data){
  if(!data || typeof data.playerName === "undefined") {
    return;
  }
  var socket = this.socket;
  var self = this;

    var opponent = clients[data.playerName];
    db.mongoStore.get(opponent.sid, function (err, opsession) {
      if(err) {
        logger.log('warn', "failed to fetch the opponent from db");
        logger.log('warn', err);
        return;
      }

      var indexOfInvitation = opsession.invites.indexOf(socket.sid);
      var wasInvited = (indexOfInvitation !== -1);
      if (wasInvited) {
        (_addNewGame.bind(self))(opponent, opsession);
        opsession.invites.splice(indexOfInvitation);
        opsession.save();
      } else {
        socket.emit('error', "The player has not invited you.");
      }
   });
  }

function _addNewGame(opponent, opsession) {
  var socket = this.socket;
  var session = this.session;
    
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

function _initialisePlayer() {
  if(!this.session.invitesAccepted) {
    this.session.invitesAccepted = invitesAllowed[0];
    this.session.save();
  }
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
        ((clients.indexOf(this.session.playerName) !== -1) 
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
  var self = this;
  onlineClients.forEach(function(client) {
    var isSelf = (client.sid === socket.sid);
    var getSession = Q.nbind(db.mongoStore.get, db.mongoStore);
    getSession(client.sid).then(function(session) {
      _emitAddNewPlayer.call(self, session, isSelf);
    });
  });
}

function _emitAddNewPlayer(session, isSelf) {
  this.socket.emit('addNewPlayer',
    {
      playerName: session.playerName,
      invitesAccepted: session.invitesAccepted,
      isSelf: isSelf
    });
}

function main() {
  connect.call(this);
  this.socket.on('changeMyPlayerName', changeMyPlayerName.bind(this));
  this.socket.on('requestGame', requestGame.bind(this));
  this.socket.on('acceptGame', acceptGame.bind(this));
  this.socket.on('resignGame', resignGame.bind(this));
  this.socket.on('setInvitesAccepted', changeInvitesAccepted.bind(this));
  this.socket.on('disconnect', disconnect.bind(this));
}

module.exports = {
  main : main,
};
