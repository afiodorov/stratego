"use strict";
var secret = process.env.SESSION_SECRET || 'someThinWeirdAsdflk';
var jade = require('jade')
  , http = require('http')
  , express = require('express')
  , app = express()
  , port = process.env.PORT || 5000
  , cookieParser = express.cookieParser(secret)
  , db = require('./lib/db.js')
  , arr = require('./public/src/arr.js');

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.bodyParser());
app.use(cookieParser);
app.use(express.session({store: db.mongoStore, secret: secret})); 

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  process.on('uncaughtException', function(err) {
      console.log(err);
  });
  app.use(express.errorHandler());
});

app.use(express.static(__dirname + '/public/'));

app.get('/lobby', function(req, res){
  res.render('lobby');
});

var server = http.createServer(app);
server.listen(port);
var io = require('socket.io').listen(server)
  , SessionSockets = require('session.socket.io')
  , sessionSockets = new SessionSockets(io, db.mongoStore, cookieParser);
io.set('log level', 1);
console.log('http server listening on %d', port);

var lobby = require('./lib/lobby.js');
var clientsettings = require('./lib/client.js');

sessionSockets.on('connection', function(err, socket, session) {
	var client = new clientsettings.Client(io, socket, session);
	lobby.main(client, err);
});
