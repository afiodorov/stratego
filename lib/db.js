'use strict';
/*jslint node: true*/
var mongoose = require('mongoose');
var argv = require('optimist').argv;
var express = require('express');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

var Schema = mongoose.Schema;

module.exports.mongoose = mongoose;
module.exports.Schema = Schema;

var url = argv.MONGOLAB_URI ||
      process.env.MONGOLAB_URI ||
      process.env.MONGOHQ_URL ||
      'mongodb://localhost/mydb';

function connect() {
  mongoose.connect(url, {auto_reconnect: true});
}

connect();

function disconnect() {mongoose.disconnect();}

var mongoStore = new MongoStore({url: url, autoReconnect: true});

exports.url = url;
exports.mongoStore = mongoStore;
