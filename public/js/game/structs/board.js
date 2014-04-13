/// <reference path="tile.js" />
/// <reference path="../../lib/underscore.js" />
/// <reference path="piece.js" />
/// <reference path="side.js" />

var side = require('./side.js');

var makeBoard = function (gameState) {
  // We are defining the tiles' position by its' location in the array.
  // All postional relatives will be assuming that the Shire is South, and that Mordor is North.
  // The shire will be at the top of the board with a 0 row index, Mordor at the bottom, with the highest row index.
  var tiles = (function () {
    var makeTile = require('./tile.js');
    var _ = require("../../lib/underscore.js");
    var tilesArr = [];
    _.range(7).forEach(function (i) { tilesArr[i] = []; });

    var addTile = function (name, cap, xpos, ypos) {
      tilesArr[ypos][xpos] = makeTile(name, cap, { x: xpos, y: ypos });
    }
    addTile('The Shire', 4, 0, 0);
    addTile('Arthedam', 2, 0, 1);
    addTile('Cardolan', 2, 1, 1);
    addTile('Rhudaur', 2, 0, 2);
    addTile('Eregion', 2, 1, 2);
    addTile('Enedwaith', 2, 2, 2);
    addTile('The High Pass', 1, 0, 3);
    addTile('Misty Mountains', 1, 1, 3);
    addTile('Caradoras', 1, 2, 3);
    addTile('Gap Of Rohan', 1, 3, 3);
    addTile('Mirkwood', 2, 0, 4);
    addTile('Fangorn', 2, 1, 4);
    addTile('Rohan', 2, 2, 4);
    addTile('Gondor', 2, 0, 5);
    addTile('Dagorlad', 2, 1, 5);
    addTile('Mordor', 4, 0, 6);
    return tilesArr;
  })();

  var allPieces = (function () {
    var makePiece = require('./piece.js');
    var pieces = [];
    pieces.push(makePiece('gandalf', 'Dark Player must play his card first', 5, side.LIGHT));
    pieces.push(makePiece('aragorn', 'May attack any adjacent region', 4, side.LIGHT));
    pieces.push(makePiece('boromir', 'Both Boromir and Enemy character are instantly defeated', 0, side.LIGHT));
    pieces.push(makePiece('frodo', 'When attacked, may retreat sideways', 1, side.LIGHT));
    pieces.push(makePiece('gimly', 'Instantly defeats the Orcs', 3, side.LIGHT));
    pieces.push(makePiece('legolas', 'Instantly defeats the Flying Nazgul', 3, side.LIGHT));
    pieces.push(makePiece('merry', 'Instantly defeats the Witch King', 2, side.LIGHT));
    pieces.push(makePiece('pippin', 'When attacking may retreat backwards', 1, side.LIGHT));
    pieces.push(makePiece('sam', 'When with Frodo, is Strength 5 & may replace Frodo in battle', 2, side.LIGHT));

    pieces.push(makePiece('orcs', 'When attacking instantly defeats the first character', 2, side.DARK));
    pieces.push(makePiece('shelob', 'After Shelob defeats an Enemy character, she is immediately returned to Gondor', 5, side.DARK));
    pieces.push(makePiece('saruman', 'May decide that no cards are played', 4, side.DARK));
    pieces.push(makePiece('flying nazgul', 'May attack a single Light character anywhere on the board', 3, side.DARK));
    pieces.push(makePiece('barlog', 'When in Moria instantly defeats any Character using the Tunnel', 5, side.DARK));
    pieces.push(makePiece('warg', 'Enemy character\'s text is ignored', 2, side.DARK));
    pieces.push(makePiece('black rider', 'May move forward any number of regions to attack', 4, side.DARK));
    pieces.push(makePiece('witch king', 'May attack sideways', 5, side.DARK));
    pieces.push(makePiece('cave troll', 'The Dark Player\'s card has no value or effect', 9, side.DARK));
    return pieces;
  })();

  var friendlyPieces = allPieces.filter(function (piece) { allPieces.map(function(p) {return p.name;}).indexOf(piece.name) !== -1 });

  var enemyPieceLocs = gameState.enemyPieces;
  
  var playerSide = gameState.friendlyPieces[0].side;

  var validMoveFuncs = (function () {

    var getVerticleAdjTiles = function (tile, goingNorth) {
      var targetRow = tile.position.y + (goingNorth ? -1 : +1);
      if (targetRow >= tiles.length || targetRow < 0) {
        return [];//ensures tiles[targetRow] always exists below.
      }
      if (tiles[targetRow].length > tiles[tile.position.y].length) {
        return [tiles[targetRow][tile.position.x], tiles[targetRow][tile.position.x + 1]];
      }
      else {
        return [tiles[targetRow][tile.position.x], tiles[targetRow][tile.position.x - 1]].filter(isDefined);
      }
    }

    var isDefined = function (obj) {
      return obj !== undefined;
    }

    var isNotAtMaxCap = function (tile) {
      return !tile.isAtMaxCap();
    }

    var getHorizontalAdjTiles = function (tile) {
      return [tiles[tile.position.y][tile.position.x - 1], tiles[tile.position.y][tile.position.x + 1]].filter(isDefined);
    }

    //potential refers to it being prior to the check that the square actually has space.
    var getPotentialForwards = function (tile) {
      var forwardTiles = getVerticleAdjTiles(tile, playerSide === side.DARK);
      if (playerSide === side.LIGHT && tile === tiles[2][1]) {//You can take a shortcut from this square if you're on the light side. 
        forwardTiles.push(tiles[4][1]);
      }
      return forwardTiles;
    }

    var getPotentialBackwards = function (tile) {
      return getVerticleAdjTiles(tile, playerSide === side.LIGHT);
    }

    var getPotentialSideways = function (tile) {
      if (tile.position.y === 3) {//Mountains, maybe this should be stored in the tile itself?
        return [];
      }
      if (tile.position.y === 4) {//River, see above.
        if (playerSide === side.DARK) {
          return [];
        }
        return [tiles[4][tile.position.x - 1]].filter(isDefined);
      }
      return getHorizontalAdjTiles(tile);
    }

    var validSideways = function (tile) {
      return getPotentialSideways(tile).filter(isNotAtMaxCap);
    }

    var validForwards = function (tile) {
      return getPotentialForwards(tile).filter(isNotAtMaxCap);
    }

    var validBackwards = function (tile) {
      return getPotentialBackwards(tile).filter(isNotAtMaxCap);
    }

    return {
      forwards: validForwards,

      backwards: validBackwards,

      sideways: validSideways
    };
  })();

  return {
    tiles: tiles,
    validMoveFuncs: validMoveFuncs,
    friendlyPieces: friendlyPieces,
    enemyPieceLocs: enemyPieceLocs,
    //Less than ideal, only used in tests atm, Not sure I want to use this properly
    side: playerSide,
    sideString: playerSide === side.DARK ? side.darkString : side.lightString
  };
}


module.exports =
  {
    makeBoard: makeBoard
  };


