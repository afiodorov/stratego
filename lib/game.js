function requestGameStatus(game) {
  console.log(game);
}

function main() {
  this.socket.on('requestGameStatus', requestGameStatus.bind(this));
}

module.exports = {
  main : main
};
