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
      dark: {pieces: [PiecesSchema],
            cards: [CardsSchema]},
      light: {pieces: [PiecesSchema],
            cards: [CardsSchema]}
    }
});

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

function addPlayers(instance, player1, player2, player1Side) {
  var player2Side;
  switch(player1Side) {
    case side.LIGHT:
    case side.DARK:
      player2Side = logic.getOppSide(player1Side);
    break;
    case 'random':
      player2Side = logic.generateRandomSide();
      player1Side = logic.getOppSide(player2Side);
    break;
    default:
      throw new Error('unrecognised side');
  }

  instance.players = [{sid: player1, side: player1Side}, 
    {sid: player2, side: player2Side}];
}

function initialiseCards(instance) {
}

function initialisePieces(instance) {
  instance.state.light.pieces = logic.generateStartPosition(side.LIGHT);
  instance.state.dark.pieces = logic.generateStartPosition(side.DARK);
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

function create(player1, player2, player1Side) {
  var pInstance = getInstancePromise();
  return pInstance.then(
  function(instance) {
    addPlayers(instance, player1, player2, player1Side);
    initialiseState(instance);
    initialiseCards(instance);
    initialisePieces(instance);
    return makePromise(instance);
  }).then(saveInstance).fail(function(err) {
    logger.log('warn', 'cannot create a game');
    logger.log('warn', err);
  });
}

var gameFind = Q.nfbind(Game.find.bind(Game));
var gameFindOne = Q.nfbind(Game.findOne.bind(Game));

function getInstances(playerSid) {
  return gameFind({players: {$elemMatch: {'sid': playerSid}}});
}

function findOne(gameId, playerSid) {
  return gameFindOne({'_id': gameId, players: {$elemMatch: {'sid':
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
