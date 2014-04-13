## /public/js/logic.js

~~~~ {.javascript}
/**
* @nothrow
* @param {string} clientStateJson Json of the client game state
* @param {string} Name of a piece as in /public/js/structs/pieces.js
* @return {array} Array of indices of all valid moves
*/
function validMoves(clientStateJson, piece) {

}
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

All the auxilary functions the client gui board needs go here too, so that
server does not require Board class at all

~~~~ {.javascript}
/**
* @nothrow
* @param {string} clientStateJson Json of the client game state
* @return {array} Array of strings of all cards
*/
function validCards(clientStateJson) {

}
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
