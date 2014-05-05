'use strict';
var db = require('../lib/db.js');
var logic = require('../public/js/game/logic.js');
var Session = require('./Session.js');
var Q = require('q');
var _ = require('../public/js/lib/lodash.js');
var logger = require('../lib/logger.js');
var side = require('../public/js/game/structs/side.js');
var stage = require('./structs/stage.js');
var interactions = require('../public/js/game/structs/interactions.js');
var GameEvent = require('../public/js/events.js').Game;

function makePromise(toBePromised) {
  return Q.fcall(function() {
    return toBePromised;
  });
}

var PlayerSchema = new db.Schema({sid: String, side: String});
var PiecesSchema = new db.Schema({
  name: String,
  position: {col: Number, row: Number},
  ownerSid: String
});

var CardsSchema = new db.Schema({name: String});
var GameSchema = new db.Schema({
  players: [PlayerSchema],
  state: {
    turn: String,
    stage: String,
    pieces: [PiecesSchema],
    cards: [CardsSchema]
  }
});

GameSchema.methods.getOpponentSid = function (playerSid) {
  return this.players.filter(function(SidSidePair) {
    return SidSidePair.sid !== playerSid;
  })[0].sid;
};

GameSchema.methods.getGameEvent = function(clientSid) {
  var self = this;
  var opponentSid = this.getOpponentSid(clientSid);
  return Session.get(opponentSid).then(
    function(opSession) {
      var candidateEvent = _.clone(self.toObject());
      candidateEvent.opponentName = opSession.playerName;
      candidateEvent.state.friendlyPieces = candidateEvent.state.pieces.filter(function(piece){ return piece.ownerSid === clientSid; });
      candidateEvent.state.enemyPieces = candidateEvent.state.pieces.filter(function(piece){ return piece.ownerSid === opponentSid; });

      if(self.state.stage === stage.START) {
        candidateEvent.state.requiredInteraction = interactions.chooseStartingPositions;
    }
      var gameEvent = new GameEvent(candidateEvent);
      if(gameEvent.isValid) {
        return makePromise(gameEvent);
      }
      throw new Error('Couldn\'t constuct the event');
    });
};

var Game = db.mongoose.model('Game', GameSchema);

function getInstancePromise() {
  return Q.fcall(function() {
    return new Game();
  });
}

function addPlayers(instance, player1Sid, player2Sid, player1Side) {
  var player2Side;
  switch(player1Side) {
    case side.LIGHT:
    case side.DARK:
      player2Side = side.opposite(player1Side);
    break;
    case 'random':
    // same as default
    default:
      player2Side = side.random();
      player1Side = side.opposite(player2Side);
    break;
  }

  instance.players = [{sid: player1Sid, side: player1Side}, 
    {sid: player2Sid, side: player2Side}];
}

function initialiseCards(instance) {
}

function initialisePieces(instance) {
  instance.state.pieces = [];
  instance.players.forEach(function(playerSidSide) {
    instance.state.pieces = instance.state.pieces.concat(
      logic.randomStartPositions(playerSidSide.side).map(
        function(piece) {
          piece.ownerSid = playerSidSide.sid;
          return piece;
        })
    );
  });
}

function initialiseState(instance) {
  instance.state.turn = side.DARK;
  instance.state.stage = stage.initial;
}

function saveInstance(instance) {
  instance.save(function(err) {
    if (err) {
      throw new Error(err);
    }
  });
  return makePromise(instance);
}

function create(player1Sid, player2Sid, player1Side) {
  var pInstance = getInstancePromise();
  return pInstance.then(
  function(instance) {
    addPlayers(instance, player1Sid, player2Sid, player1Side);
    initialiseState(instance);
    initialiseCards(instance);
    initialisePieces(instance);
    return makePromise(instance);
  }).then(saveInstance).fail(function(err) {
    logger.log('warn', 'cannot create a game');
    logger.log('warn', err);
  });
}

var BoundFind = Q.nfbind(Game.find.bind(Game));
var BoundFindOne = Q.nfbind(Game.findOne.bind(Game));

function getAll(playerSid) {
  return BoundFind({players: {$elemMatch: {'sid': playerSid}}});
}

function findOne(gameId, playerSid) {
  return BoundFindOne({'_id': gameId, players: {$elemMatch: {'sid':
   playerSid}}});
}

module.exports = {
  find: function(callback) {
    Game.find().sort('_id', 'descending').limit(5).exec(callback);
  },
  create: create,
  getAll: getAll,
  findOne: findOne,
  Schema: GameSchema,
  Model: Game
};
