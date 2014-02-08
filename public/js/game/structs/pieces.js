"use strict";

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
  pieces : pieces
};
