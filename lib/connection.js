"use strict";
function Client(io, socket, session) {
  this.io = io;
  this.socket = socket;
  this.session = session;
}

exports.Client = Client;
