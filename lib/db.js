"use strict";
var mongoose = require('mongoose');
var argv = require('optimist').argv;
var express = require('express');
var MongoStore = require('connect-mongo')(express);

var Schema = mongoose.Schema;

module.exports.mongoose = mongoose;
module.exports.Schema = Schema;

var url = process.env.MONGOLAB_URI ||
  	  process.env.MONGOHQ_URL ||
	  argv.MONGOLAB_URI ||
	  'mongodb://localhost/mydb';

function connect() {
  mongoose.connect(url, {auto_reconnect: true});
}

connect();

function disconnect() {mongoose.disconnect();}

var mongoStore = new MongoStore({url: url, auto_reconnect: true});

exports.url = url;
exports.mongoStore = mongoStore;
