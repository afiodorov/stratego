'use strict';
var db = require('../lib/db.js');
var GameLogic = require('../public/js/game/logic.js');
var Q = require('q');
var PlayerSchema = new db.Schema({sid: String, side: String});
var PiecesSchema = new db.Schema({name: String, position: String});
var CardsSchema = new db.Schema({name: String});
var _ = require('../public/js/lib/underscore.js');
var logger = require('../lib/logger.js');

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
    case 'light':
    case 'dark':
      player2Side = GameLogic.getOppositeSide(player1Side);
    break;
    case 'random':
      player2Side = GameLogic.generateRandomSide();
      player1Side = GameLogic.getOppositeSide(player2Side);
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
  instance.state.light.pieces = GameLogic.generateStartPosition('light');
  instance.state.dark.pieces = GameLogic.generateStartPosition('dark');
}

function initialiseState(instance) {
  instance.state.turn = 'dark';
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

function getInstance(player1, player2, callback) {
  Game.findOne({players: [player1, player2].sort()}).exec(callback);
}

function getInstances(player, callback) {
  Game.find({players: {$elemMatch: {'sid': player}}}).exec(callback);
}

function resignPlayer(player, game, callback) {
 Game.findOne({'_id': game.id, players: player}).remove().exec(callback);
}

module.exports = {
  find: function(callback) {
    Game.find().sort('_id', 'descending').limit(5).exec(callback);
  },
  create: create,
  getInstance: getInstance,
  getInstances: getInstances,
  resignPlayer: resignPlayer,
  Model: Game
};
