'use strict';
var db = require('../lib/db.js');
var logic = require('../public/js/game/logic.js');
var Q = require('q');
var PlayerSchema = new db.Schema({sid: String, side: String});
var PiecesSchema = new db.Schema({name: String, position: String});
var CardsSchema = new db.Schema({name: String});
var _ = require('../public/js/lib/lodash.js');
var logger = require('../lib/logger.js');
var side = require('../public/js/game/structs/side.js');

var GameSchema = new db.Schema({
  players: [PlayerSchema],
  state: 
    {
      turn: String,
      stage: String,
      dark: {
        pieces: [PiecesSchema],
        cards: [CardsSchema]
      },
      light: {
        pieces: [PiecesSchema],
        cards: [CardsSchema]
      }
    }
});

GameSchema.methods.getClientStateJson = function(clientSid) {
  var gameClientJson = _.clone(this.toObject());
  return gameClientJson;
};

var Game = db.mongoose.model('Game', GameSchema);

function getInstancePromise() {
  return Q.fcall(function() {
    return new Game();
  });
}

function makePromise(instance) {
  return Q.fcall(function() {
    return instance;
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
  instance.state.light.pieces = logic.randomStartPositions(side.LIGHT);
  instance.state.dark.pieces = logic.randomStartPositions(side.DARK);
}

function initialiseState(instance) {
  instance.state.turn = side.DARK;
  instance.state.stage = 'start';
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

function getInstances(playerSid) {
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
  getInstances: getInstances,
  findOne: findOne,
  Model: Game
};
