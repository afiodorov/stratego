function getStatus(game) {
  console.log(game);
}

function main() {
  this.socket.on('gGetStatus', getStatus.bind(this));
}

module.exports = {
  main: main
};
