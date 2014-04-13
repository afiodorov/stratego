function playCard(game) {

}

function movePiece(game) {

}

function main() {
  this.socket.on('playCard', playCard.bind(this));
  this.socket.on('movePiece', movePiece.bind(this));
}

module.exports = {
  registerHandlers: main
};
