"use strict";
function Client(io, socket, session) {
  this.io = io;
  this.socket = socket;
  this.session = session;
}

module.exports = {
  Client : Client
};
