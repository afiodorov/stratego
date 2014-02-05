var _ = require('../lib/underscore.js');

var tiles = (function() {
  var NUM_OF_ROWS = 7;
  var NUM_OF_COLS = 4;

  var columnLimit = function(colNumber) {
    return (colNumber > NUM_OF_ROWS / 2) ? NUM_OF_ROWS + 1 - colNumber : colNumber;
  };

  /** 
   * Returns whether a grid index is valid
   * Call with int, int or [int, int]
   */
  var isWithinGrid = function(row_, col_) {
    var row = row_;
    var col = col_;
    if (arguments.length === 0 || arguments.length > 2) {
      throw new TypeError("Call with coordinates");
    }

    if(arguments.length === 1) {
      if( Object.prototype.toString.call( row_ ) !== "[object Array]" 
        || row_.length !== 2) {
        throw new TypeError("Call with coordinates array of length 2");
      }
      row = row_[0];
      col = row_[1];
    }

    if(isNaN(row) || row < 1 || row > NUM_OF_ROWS) {
      return false;
    }

    if(isNaN(col) || col < 1 || col > columnLimit(col)) {
      return false;
    }

    return true;
  };

  var tiles = [];
  var i;
  for(i=1; i <= NUM_OF_ROWS; i++) {
    tiles[i] = [];
  }
  tiles[1][1] = { capacity: 4, name: "The Shire" };
  tiles[2][1] = { capacity: 2, name: "Arthedam" };
  tiles[2][2] = { capacity: 2, name: "Cardolan" };
  tiles[3][1] = { capacity: 2, name: "Rhudaur" };
  tiles[3][2] = { capacity: 2, name: "Eregion" };
  tiles[3][3] = { capacity: 2, name: "Enedwaith" };
  tiles[4][1] = { capacity: 1, name: "The High Pass" };
  tiles[4][2] = { capacity: 1, name: "Misty Mountains" };
  tiles[4][3] = { capacity: 1, name: "Caradoras" };
  tiles[4][4] = { capacity: 1, name: "Gap Of Rohan" };
  tiles[5][1] = { capacity: 2, name: "Mirkwood" };
  tiles[5][2] = { capacity: 2, name: "Fangorn" };
  tiles[5][3] = { capacity: 2, name: "Rohan" };
  tiles[6][1] = { capacity: 2, name: "Gondor" };
  tiles[6][2] = { capacity: 2, name: "Dagorlad" };
  tiles[7][1] = { capacity: 4, name: "Mordor" };

  var makeTiles = function(tiles) {
    var mytiles = new Array(0);
    var j;
    for(i=1; i <= NUM_OF_ROWS; i++) {
      for(j=1; j<=columnLimit(i); j++) {
        mytiles.push(tiles[i][j]);
        Object.defineProperty(mytiles, [i,j], {
          enumerable: false,
          value: tiles[i][j]
        });
      }
    }

    mytiles.NUM_OF_ROWS = NUM_OF_ROWS;
    Object.defineProperty(mytiles, "NUM_OF_ROWS", {
      enumerable: false,
    });

    mytiles.NUM_OF_COLS = NUM_OF_COLS;
    Object.defineProperty(mytiles, "NUM_OF_COLS", {
      enumerable: false,
    });

    mytiles.columnLimit = columnLimit;
    Object.defineProperty(mytiles, "columnLimit", {
      enumerable: false,
    });

    mytiles.isWithin = isWithinGrid;
    Object.defineProperty(mytiles, "isWithin", {
      enumerable: false,
    });

    Object.freeze(mytiles);
    return mytiles;
  };

  return makeTiles(tiles);
}());

var pieces = (function(){
  var pieces = Object.create(null);
  pieces.light = Object.create(null);
  pieces.light = { 
    "gandalf" :
      {
        strength: 5,
        description: "Dark Player must play his card first"
      },
    "aragorn" : 
      {
        strength: 4, 
        description: "May attack any adjacent region"
      },
    "boromir" :
      {
        strength: 0,
        description: "Both Boromir and Enemy character are instantly defeated"
      },
    "frodo" : 
      {
        strength: 1,
        description: "When attacked, may retreat sideways"
      },
    "gimly" : 
     {
       strength: 3,
       description: "Instantly defeats the Orcs"
     },
     "legolas" :
     {
      strength: 3,
      description: "Instantly defeats the Flying Nazgul"
     },
     "merry" : 
     {
      strength: 2,
      description: "Instantly defeats the Witch King"
     },
     "pippin" :
     {
       strength: 1,
       description: "When attacking may retreat backwards"
     },
     "sam" :
     {
      strength: 2,
      description: "When with Frodo, is Strength 5 & may replace Frodo in battle"
     }
  };

  pieces.dark = Object.create(null);
  pieces.dark = {
    "orcs" : 
    {
      strength: 2,
      description: "When attacking instantly defeats the first character"
    },
    "shelob" :
    {
      strength: 5,
      description: "After Shelob defeats an Enemy character, she is immediately returned to Gondor"
    },
    "saruman" :
    {
      strength: 4,
      description: "May decide that no cards are played"
    },
    "flying nazgul" :
    {
      strength: 3,
      description: "May attack a single Light character anywhere on the board"
    },
    "barlog" : 
    {
      strength: 5,
      description: "When in Moria instantly defeats any Character using the Tunnel"
    },
    "warg" :
    {
      strength: 2,
      description: "Enemy character's text is ignored"
    },
    "black rider":
    {
      strength: 4,
      description: "May move forward any number of regions to attack"
    },
    "witch king" :
    {
      strength: 5,
      description: "May attack sideways"
    },
    "cave troll" :
    {
      strength: 9,
      description: "The Dark Player's card has no value or effecat"
    }
  };
  Object.freeze(pieces);
  return pieces;
}());

module.exports = {
  tiles : tiles,
  pieces : pieces
};
