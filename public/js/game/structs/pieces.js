var side = require('./side.js');

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

