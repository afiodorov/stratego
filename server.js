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
app.use(cookieParser(secret));
var session = express_session({
  store: db.mongoStore,
  secret: secret,
  resave: false,
  saveUninitialized: true
});
app.use(session);

if(app.get('env') === 'development') {
  app.use(express_error_handler({ dumpExceptions: true, showStack: true }));
}

app.use(express_static(__dirname + '/public/'));

/**
 */
app.get('/', function(req, res){
  res.render('lobby');
});

app.get('/canvas', function(req, res){
  res.render('canvasPlayground');
});

var server = http.createServer(app);
server.listen(port);

var io = require('socket.io')(server);
logger.log('info', 'http server listening on %d', port);

var lobby = require('./socketHandlers/lobby.js');
var game = require('./socketHandlers/game.js');
var chat = require('./socketHandlers/chat.js');
var makeStruct = require('./public/js/lib/structFactory.js');

var ActiveConnection = makeStruct('io socket session');

io.of('/lobby').use(function(socket, next) {
  var req = socket.request;
  var res = socket.request.res;

  session(req, res, next);
  cookieParser(req, res, function(err) {
    if (err) {
      console.log(err);
      return next(err);
    }
  });
});

io.of('/lobby').on('connection', function(socket) {
  var session = socket.request.session;

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
