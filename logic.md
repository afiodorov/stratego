## /public/js/logic.js

~~~~ {.javascript}
/**
* @nothrow
* @param {string} clientStateJson Json of the client game state
* @piece {string} Name of a piece as in /public/js/structs/pieces.js
* @returns {array} Array of indices of all valid moves
*/
function validMoves(ClientStateJson, piece) {

}
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

All the auxilary functions the client gui board needs go here too, so that
server does not require Board class at all

~~~~ {.javascript}
/**
* @nothrow
* @param {string} clientStateJson Json of the client game state
* @returns {array} Array of strings of all cards
*/
function validCards(ClientStateJson) {

}
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
