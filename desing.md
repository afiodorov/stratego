Design

# Socket.io, session and socket recap

Each connection with a server has a socket. Socket is lost if connection is
lost (e.g. refresh), therefore each connection also mantains a session, which
is not lost due to cookies on the client's side.

Once a game between 2 players starts 2 sockets are joined by the game.id (auto
generated) into a "chat-room"

Servers and clients emit and handle custom events like this:

### server
socket.of(game.id).broadcast('gameOver'); // just announced to everyone in the game that it's over

### client
socket.emit('makeMove', {gameId: gameid, "gandalf to mordor"});

# Bird eye view

Clients keep the current state of the game in GameState instance, which
resembles heavily server's GameScheme json shema, which is stored in MongoDB.

Noticeable differences between client's game state and server's game state:
* Clients don't have opponents' pieces names, just the locations
* Clients don't know opponents' ids.

Clients however know game.id of each game, which is an auto-generated id from the MongoDB.

Once the page is built the following happens for each game the client has:
1. The lobby requests the state of each game
2. GameController object is created

GameController objects holds references to GUI, e.g. Board and Hand (of cards)
and a referce to gameState.

As game state changes on the server side, server sends new game scheme json
(without the opponents pieces' names of course). Upon receiving that
GameController updates the model (=gameState).

I decided that the model and GUI have Observer / Subject pattern, i.e. GUI is
an observer of the model.

When game is loaded for the first time the GameController adds GUI as observers
to the model, i.e once gameController updates gameState, gameState calls
board.update(gameState), hand.update(gameState).

hand.update, board.update methods actually refresh the canvas.

# Gui

Each hand and board object is a container for an array of the Knockout
objects, which are visible on canvas, e.g. KnockoutPiece (KPiece) and KCard.

To construct such objects from gameState, (static) GameStructs class is needed which
contain an additional information about each piece/card.

GameState is a lightweight object by design, so that communication with a
server is responsive. Besides rules don't change throughout the game, so don't
see the point of exchanging them all the time.

# More Details

GameController is the only class which is capable of speaking to the server.
GameController can also refresh GUI.

However, GUI and GameController have a mixin pattern and are heavily coupled:
hand.emitters = gameController.guiEvents.

gameController.guiEvents contains the human interaction with gui, which require
either of the following:
* gameState must be known for the response
* gameSocket must be known (to post the event off to the server)

Examples:

* A player picked up a card - does not require gameState for GUI to highligh the
designated area, it should not be in the guiEvents.
Instead, it should just be in hand, e.g. hand.highlightWhereToDrop();

* A player played a card - requires checking whether he has that card, so
gameState is required. The following happens:
The gameController calls GameLogic.canPlayCard(gameState) method,
if it's ok it emits it off to the server to deal with it, and we simply wait
for server to respond with new stateJson. The controller could block further
input at this point.

* A player picked up a piece - requires showing the player where he is allowed to drop it,
hence the handler must be defined in gameController.guiEvents.

# Server Side

Currently the pseudo code is missing, but the concept is simple:

Server will receive a bunch of events, e.g.
'playCard', 'movePiece' and so on, will check whether it's ok reusing the 
GameLogic class and finally update the database, using the ./models/Game.js class,
where a bunch of handy methods will be present (e.g. Game.playcard("dark", "3"))

Upon success it fires off 'gameState' event and the gui of the games is eventually updated, though a mechani outlined above.

~~~~ {.javascript}
socket.on('playCard', , function(card /*{cardName: 'retreat', gameid: 'gameid'}*/) {
  // check if socket is allowed to play game and get socket's side
  Game.getClientGameState(gameid, socket.sid, function(err, gameState) {
    if(err) {
      // log
      return;
    }
    var newClientGameState = GameLogic.isValidCard(gameState, card);
    if(newGameState.err) {
      return;
    }
    newClientGameState = newGameState.newState;

    Game.playCard(gameid, function(err, newOpponentClientGameState) {
      if(err) {
        return;
      }
      // emit gameStates
    }
  });
}
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

# Client:
    
~~~~ {.javascript}
var gameStructs = {};
gameStructs.tiles = [];
gameStructs.tiles[0]  = { capacity: 4, name: "The Shire" };
gameStructs.tiles[1]  = { capacity: 2, name: "Arthedam" };
gameStructs.tiles[2]  = { capacity: 2, name: "Cardolan" };
// ...

gameStructs.pieces = [];
gameStructs.pieces = [
  "gandalf":
    {strength: "5",
    description: "dark player plays his card first"}
  ,
  // all pieces go here, even opponent player's
];
gameStructs.getPiece(piecesName) {
  return /* find piece object in pieces arr */

};

var GameState = function() {
  var self = this;
  self.mySide = "light";
  self.stage = "game"; // start, game, battle
  self.turn = "light";
  self.light =  {
    piecesLeft: [{name: "gandalf", position: [2,2]}],
    cardsLeft: ["3", "retreat"]
  };
  self.dark = {
    piecesLeft: [{position: [3,1]}],
    cardsLeft: ["1", "magic"]
  };
  // each Observer must implement update() function
  self.observers = [];
}

/* the ONLY way server updates gui is through this */
GameState.prototype.setState = function(stateJson /* state Json received from server */) {
  // parse what changed and call each observer's update();
  // no state validation here - we can trust the server
}

/* this is a massive class which has GameStructs as dependency,
it has all the rules in here and it is shared between server and client
*/
var GameLogic = (function {   
  // some private methods if there's a difference between server and client data representation
  return {
    ioveValid: function(gameState, move) {

    }
  }
})();

/* it ties GUI, model and interaction with the server together 
   it is allowed to call hand and board public methods,
   and it calls GameLogic before emitting an event.

   It receives 'setState' event from the server and updates the view.
*/
var GameController = function(gameId_, gameSocket_) {
  var self = this;
  var isInitialised = false;

  self.gameId = gameId_;
  self.context = $("#" + gameId + " canvas.game-canvas")[0].getContext('2d');
  self.gameState = new GameState();
  self.gameSocket = gameSocket_;
  self.board = new Board(context);
  self.hand = new Hand(context);
  gameSocket.on("gameState", function(gameJson) {
    if(!isInitialised) {
      board.initState(gameJson);
      board.addEmitters(self.guiEvents);
      gameState.observers.add(board);

      hand.initState(gameJson);
      hand.addEmitters(self.guiEvents);
      gameState.observers.add(hand);
    }
    self.gameState.setState(stateJson);
  }
}

GameController.prototype.guiEvents = {
  self = this;
  getAvailableTiles : function(event) {
  return GameLogic.getTiles(self.gameState, event);
  },
  movePiece : function(event) {
    if(GameLogic.ioveValid(self.gameState, event) {
      self.gameSocket.emit("movePiece", event);
    } else {
      self.showError({type: "invalidMove", text: "Against the rules"});
    }
  };
  playCard : function(event) {
    if(GameLogic.isPlayCardValid(self.gameState, event) {
      self.gameSocket.emit("playCard", event);
    } else {
      self.showError({type: "invalidMove", text: "Against the rules"});
    }
  }
}

GameController.prototype.showError(errorObj) {
  // show notifaction
}

/* this is KinectJS piece
it maintains a referece (parent) to it's container (board), so
that it can call board's public interface directly (if
gameState/gameSocket is not required),
or indirectly, through parent.emitters
*/
var KPiece = function(parent_, pieceName_, location) {
 // set up more things to display, use gameStructs.pieces for information
  var self = this;
  var parent = parent_;
  self.pieceName= pieceName_;
  self.x = getXFromLocation(location);
  self.y = getYFromLocation(location);
};
KPiece.prototype = getXFromLocation();
KPiece.prototype = getYFromLocation();

KPiece.move = function(newLocation) {
  this.x = getXFromLocation(newLocation);
  this.y = getYFromLocation(newLocation);
  // tell Kinect to redraw;
};
/* player picked up a piece */
KPiece.onMove = function(newLocation) {
    /* 
    any interaction requiring the current state - through the gameController!
    */
  var tilesToHighlight = 
    this.parent.emitters.getAvailableTiles(self.pieceName);
  this.parent.highlightTiles(tilesToHighlight);
};

var Board = function(context_) {
  var self = this;
  self.emitters = null;

  var context = context_;
  // let's hide the fact that we use KineticJS from the rest of the world
  self._kPieces = {
    // sample
    //"gandalf": kGandalf,
    //"frodo" : kFrodo
  };
};

Board.prototype.initState = function(gameState /*lightweight JSON object*/) {
  for(piece in gameState.pieces) {
     this._kPieces.push({piece.name: new KPiece(self, piece.name, piece.location)});
  }
};

Board.prototype.addEmitters = function(o) {
  this.emitters = o;
}

Board.prototype.update = function(gameState) {
   // update each kPiece 
   // no gameState validation here
};

Board.prototype.highlightTiles(tiles) {
   // show user where he can move his next tile
};

var KCard = function(parent_, name) {
  var self = this;
  self.parent = parent_;
};

KCard.prototype.onMove = function() {
  this.parent.highlightWhereToDrop();
}

var Hand = function(context_) {
  var self = this;
  var context = context_;
  self.emitters = null;
  self._kCards = [];
};

Hand.prototype.initState = function(gameState) {
  for(/*for card in parsed gameState */) { 
    this._kCards.push({card.name: new KCard(self, card.name)});
  }
};

Hand.prototype.addEmitters = function(o) {
  this.emitters = o;
}

Hand.prototype.highlightWhereToDrop = function() {

}

Hand.prototype.update = function(gameState) {
  // refresh this._kCards
};
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
