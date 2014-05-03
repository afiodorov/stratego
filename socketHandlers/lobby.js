var clients = [];
var Q = require('q');
var db = require('./../lib/db.js');
var lobbyutils = require('./../lib/lobbyutils.js');
var makeStruct = require('../public/js/lib/structFactory.js');
var Client = makeStruct("socket sid");
var InviteRecord = makeStruct("opponentSid mySide");
var Game = require('./../models/Game.js');
var _ = require('./../public/js/lib/underscore.js');
var gameutils = require('./../models/utils/gameutils.js');
var events = require('./../public/js/events.js');

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
  // each game has a corresponding socket room
  _joinGameRooms.call(this);
  _checkForDuplicateSession.call(this, onlineClients);
  _setSocketPlayerName.call(this, clients);
  _initialisePlayer.call(this);
  _sendListOfGames.call(this);
  _sendListOfPlayers.call(this, onlineClients);

  clients[session.playerName] = new Client(socket, session.id);
  socket.broadcast.emit('addNewPlayer', _buildPlayerEvent(session, false));
}

function disconnect() {
    this.io.of('/lobby').emit('removePlayerName', 
      {playerName: this.session.playerName, isSelf: false});
}

function resignGame(gameId) {
  var io = this.io;
  var socket = this.socket;
  var session = this.session;
  Game.findOne(gameId, this.session.id).then(function(game) {
    if(game) {
      game.remove();
      io.of('/lobby').in(gameId).emit('removeGame', gameId);
      socket.broadcast.to(gameId).emit('opponentResigned', session.playerName);
    }
  });
  require('../models/Chat.js').removeMessages(gameId);
}

function changeMyPlayerName(playerName) {
  var socket = this.socket;
  var session = this.session;

  if(!playerName) {
    socket.emit('failChangingName', 'No player name provided');  
    return;
  }

  if(clients.indexOf(playerName) !== -1) {
    socket.emit('failChangingName', 'Duplicate player name');  
    return;
  }

  delete clients[session.playerName];
  socket.broadcast.emit('removePlayerName', _buildPlayerEvent(session, false));
  socket.emit('removePlayerName', _buildPlayerEvent(session, true));
  session.playerName = playerName;
  session.save();
  clients[session.playerName] = new Client(socket, socket.sid);
  socket.broadcast.emit('addNewPlayer', _buildPlayerEvent(session, false));
  socket.emit('addNewPlayer', _buildPlayerEvent(session, true));
}

function requestGame(uInvite) {
  var session = this.session;
  var inviteFromPlayer = new events.InviteFromPlayer(uInvite);
  if(!inviteFromPlayer.isValid) {
    return;
  }
  try {
    var opponent = clients[inviteFromPlayer.opponentName];
    if(!opponent) {
      logger.log('info', 'couldn\'t find an opponent');
      return;
    }
    var getSession = Q.nbind(db.mongoStore.get, db.mongoStore);
    getSession(opponent.sid).then(function(opSession) {

      if(opSession.acceptedInvites === 'none') {
        logger.log('info', 'invite not accepted: none accepted');
        return;
      }

      if(opSession.acceptedInvites === 'dark'
        && inviteFromPlayer.mySide !== 'light') {
          logger.log('info', 'invite not accepted: dark accepted');
          return;
      }

      if(opSession.acceptedInvites === 'light'
        && inviteFromPlayer.mySide !== 'dark') {
          logger.log('info', 'invite not accepted: light accepted');
          return;
      }

      opponent.socket.emit('requestGame', 
        {opponentName: session.playerName,
          opponentSide: inviteFromPlayer.mySide});
    });
    if (typeof session.invites === "undefined") {
      session.invites = [];
    }
    // I am inviting the opponent to the game
    var inviteRecord = new InviteRecord(opponent.sid, uInvite.mySide);
    if(!_.findWhere(session.invites, inviteRecord)) {
      session.invites.push(inviteRecord);
      session.save();
    }
  } catch(e) {
    logger.log('warn', 'can\'t fetch the game');
    logger.log('warn', e);
  }
}

function changeInvitesAccepted(invitesAccepted) {
  var socket = this.socket;
  var session = this.session;
  if(invitesAccepted && invitesAllowed.indexOf(invitesAccepted) !== -1) {
    session.invitesAccepted = invitesAccepted;
    session.save();
    socket.emit('setInvitesAccepted', invitesAccepted);
    socket.broadcast.emit('removePlayerName', _buildPlayerEvent(session, false));
    socket.emit('removePlayerName', _buildPlayerEvent(session, true));
    socket.broadcast.emit('addNewPlayer', _buildPlayerEvent(session, false));
    socket.emit('addNewPlayer', _buildPlayerEvent(session, true));
  }
}

function acceptGame(uInvite) {
  var inviteToPlayer = new events.InviteToPlayer(uInvite);
   if(!inviteToPlayer.isValid) {
    return;
  }
  var socket = this.socket;
  var self = this;

  var opponent = clients[inviteToPlayer.opponentName];
  db.mongoStore.get(opponent.sid, function (err, opsession) {
    if(err) {
      logger.log('warn', 'failed to fetch the opponent from db');
      logger.log('warn', err);
      return;
    }

    var i;
    var inviteRecordIndex = -1;
    var inviteRecord;
    for(i = 0; i < opsession.invites.length; i++) {
      inviteRecord = opsession.invites[i];
      if(inviteRecord.opponentSid === socket.sid 
        && inviteRecord.mySide === inviteToPlayer.opponentSide) {
          inviteRecordIndex = i;
          break;
      }
    }

    var wasInvited = (inviteRecordIndex !== -1);
    if (wasInvited) {
      //_addNewGame.call(self, opponent, opsession, inviteToPlayer.opponentSide);
      opsession.invites.splice(inviteRecordIndex, 1);
      db.mongoStore.set(opponent.sid, opsession);
    } else {
      socket.emit('error', "The player has not invited you.");
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
  return (typeof this.session.playerName === 'undefined');
}

function _joinGameRooms() {
  var socket = this.socket;
  var session = this.session;
  Game.getInstances(session.id).then(function(games) {
    games.forEach(function(game){
      socket.join(game.id);
    });
  }).fail(function(err) {
    logger.log('error', "problem fetching games for the session");
    logger.log('error', err);
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
  Game.getInstances(this.socket.sid)
    .then(function(games) {
      games.forEach(function(game) {
        gameutils.getClientStateJson(game.toObject(), socket.sid).then(function(state) {
          socket.emit('addGame', state);
        }).fail(function(err) {
          logger.log('info', 'couldn\'t send new game');
          logger.log('info', err);
        }).done();
      });
  });
}

function _sendListOfPlayers(onlineClients) {
  var socket = this.socket;
  onlineClients.forEach(function(client) {
    var isSelf = (client.sid === socket.sid);
    var getSession = Q.nbind(db.mongoStore.get, db.mongoStore);
    getSession(client.sid).then(function(session) {
      socket.emit('addNewPlayer', _buildPlayerEvent(session, isSelf));
    });
  });
}

function _buildPlayerEvent(session, isSelf) {
  return new events.Player ({
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
  registerHandlers: main,
};
