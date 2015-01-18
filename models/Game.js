'use strict';
/*jslint node: true*/
var AddGameEvent = require('../public/js/events/addGame.js');
var db = require('../lib/db.js');
var logic = require('../public/js/game/logic.js');
var Session = require('./Session.js');
var Q = require('q');
var _ = require('lodash');
var logger = require('../lib/logger.js');
var side = require('../public/js/game/structs/side.js');
var stage = require('../public/js/game/structs/stage.js');
var interactions = require('../public/js/game/structs/interactions.js');
var GameEvent = require('../public/js/events.js').Game;
var Tiles = _.flatten(require('../public/js/game/structs/tiles.js'));
var pieces = require('../public/js/game/structs/pieces.js');

var PlayerSchema = new db.Schema({
  sid: {type: String, required: true},
  side: {type: String, enum: _.values(side)},
  name: {type: String, required: true}
});

PlayerSchema.set('toJSON', {getters: true, virtuals: false});

var PiecesSchema = new db.Schema({
  name: {type: String, required: true},
  holder: {type: String, enum: ['tile', 'hand'], required: true},
  tileName: {type: String, enum: _.pluck(Tiles, 'name'), required: false},
  canvasCoords: {
    top: {type: Number, required: false},
    left: {type: Number, required: false}
  },
  visibleToSides: {type: [String], required: true}
});

var CardsSchema = new db.Schema({
  name: {type: String, required: true}
});

var GameSchema = new db.Schema({
  players: [PlayerSchema],
  turn: {type: String, required: false},
  stage: {type: String, required: true, enum: _.values(stage)},
  pieces: {type: [PiecesSchema], required: true},
  cards: {type: [CardsSchema], required: false}
});

/**
 * @this {Document<GameSchema>}
 * @param {struct.Side} side
 * @return {object}
 */
GameSchema.methods.getModel = function(side) {

  var gameObj = this.toJSON();

  var piecesAttr = _.groupBy(gameObj.pieces, function(piece) {
    if (piece.visibleToSides.indexOf(side) !== -1) {
      return 'VisiblePieces';
    }
    return 'HiddenPieces';
  });

  piecesAttr.HiddenPieces = _.map(piecesAttr.HiddenPieces,
    _.partialRight(_.omit, 'name'));

  piecesAttr.HiddenPieces = _.map(piecesAttr.HiddenPieces,
    _.partialRight(_.omit, 'visibleToSides'));

  piecesAttr.VisiblePieces = _.map(piecesAttr.VisiblePieces,
    _.partialRight(_.omit, 'visibleToSides'));

  return piecesAttr;
};

/**
 * @this {Document<GameSchema>}
 * @param {string} playerSid
 * @return {object}
 */
GameSchema.methods.getAddGameEvent = function(playerSid) {
  var self = this;

  var curPlayer = self.players.filter(function(player) {
    return player.sid === playerSid;
  });

  if (curPlayer.length === 0) {
    logger.log('warn', 'can not find the player');
    return {isValid: false};
  }

  curPlayer = curPlayer[0];

  var opponent = self.players.filter(function(player) {
    return player.sid !== playerSid;
  })[0];

  var addGameEvent = new AddGameEvent({
    _id: self.id,
    side: curPlayer.side,
    stage: self.stage,
    opponentName: opponent.name,
    model: self.getModel(curPlayer.side)
  });

  return addGameEvent;
};

var Game = db.mongoose.model('Game', GameSchema);

/**
 * @param {struct.Piece} piece
 * @return {PiecesSchema}
 */
var initPiece = function(piece) {
  return {
    name: piece.name,
    holder: 'hand',
    visibleToSides: [piece.side],
    canvasCoords: {}
  };
};

/**
 * @param {array<PlayerSchema>} players
 * @return {Q.promice}
 */
function create(players) {
  return Q.fcall(function() {return new Game();}).then(
  function(newGame) {
    _.assign(newGame, {
      players: players,
      stage: stage.piecesPlacement,
      pieces: _.shuffle(_.values(pieces).map(initPiece))
    });

    newGame.save(function(err) {
      if (err) {
        logger.log('warn', 'can not save the instance');
        console.log(err);
      }
    });

    return Q.fcall(function() {return newGame;});
  }).fail(function(err) {
    logger.log('warn', 'cannot create a game');
    logger.log('warn', err);
  });
}

var boundFind = Q.nfbind(Game.find.bind(Game));
var boundFindOne = Q.nfbind(Game.findOne.bind(Game));

function getAll(playerSid) {
  return boundFind({players: {$elemMatch: {'sid': playerSid}}});
}

function findOne(gameId, playerSid) {
  return boundFindOne({'_id': gameId,
    players: {$elemMatch: {'sid': playerSid}}});
}

/**
 */
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
