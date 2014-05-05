'use strict';
var callConstructor = require('../../public/js/lib/callConstructor.js');

var Client = function(socket, sid) {
  if (!(this instanceof Client)) {
    return callConstructor.apply(Client, arguments);
  }

  this.sid = sid;
  this.socket = socket;
};

module.exports = Client;
