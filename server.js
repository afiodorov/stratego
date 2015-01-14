'use strict';
var secret = process.env.SESSION_SECRET || 'someThinWeirdAsdflk';
var jade = require('jade')
  , http = require('http')
  , express = require('express')
  , app = express()
  , port = process.env.PORT || 5000
  , cookieParser = require('cookie-parser')
  , db = require('./lib/db.js')
  , express_session = require('express-session')
  , express_static = require('serve-static')
  , express_error_handler = require('express-error-handler')
  , express_body_parser = require('body-parser');

var logger = require('./lib/logger.js');

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express_body_parser.urlencoded({extended: true}));
app.use(express_body_parser.json());
app.use(cookieParser);
app.use(express_session({
  store: db.mongoStore,
  secret: secret,
  resave: true,
  saveUninitialized: true
}));

if(app.get('env') === 'development') {
  app.use(express_error_handler({ dumpExceptions: true, showStack: true }));
}

app.use(express_static(__dirname + '/public/'));

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
    logger.log('error', new Error().stack);
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
