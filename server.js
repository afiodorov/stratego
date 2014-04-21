'use strict';
var secret = process.env.SESSION_SECRET || 'someThinWeirdAsdflk';
var jade = require('jade')
  , http = require('http')
  , express = require('express')
  , app = express()
  , port = process.env.PORT || 5000
  , cookieParser = express.cookieParser(secret)
  , db = require('./lib/db.js');
var logger = require('./lib/logger.js');

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
      logger.log('error', err);
  });
  app.use(express.errorHandler());
});

app.use(express.static(__dirname + '/public/'));

app.get('/', function(req, res){
  res.render('lobby');
});

app.get('/canvas', function(req, res){
  res.render('canvasPlayground');
});

var server = http.createServer(app);
server.listen(port);
var io = require('socket.io').listen(server)
  , SessionSocket = require('session.socket.io')
  , sessionSocket = new SessionSocket(io, db.mongoStore, cookieParser);
io.set('log level', 1);
logger.log('info', 'http server listening on %d', port);

var lobby = require('./socketHandlers/lobby.js');
var game = require('./socketHandlers/game.js');
var chat = require('./socketHandlers/chat.js');
var makeStruct = require('./public/js/lib/structFactory.js');

var ActiveConnection = makeStruct('io socket session');
sessionSocket.of('/lobby').on('connection', function(err, socket, session) {
  if(err) {
    logger.log('error', 'bad session');
    logger.log('error', err);
    console.log('error', new Error().stack);
    return;
  }

  if (!session) {
    logger.log('error', 'no session present');
    return;
  }
  
  var activeConnection = new ActiveConnection(io, socket, session);
  (function() {
    lobby.registerHandlers.call(activeConnection);
    game.registerHandlers.call(activeConnection);
    chat.registerHandlers.call(activeConnection);
  }());
});
