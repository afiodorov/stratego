var secret = process.env.SESSION_SECRET || 'someThinWeirdAsdflk';
var jade = require('jade')
  , WebSocketServer = require('ws').Server
  , http = require('http')
  , express = require('express')
  , app = express()
  , port = process.env.PORT || 5000
  , parseCookie = express.cookieParser(secret)
  , MyString = require('./models/String.js')
  , MongoStore = require('connect-mongo')(express)
  , db = require('./lib/db.js')
  , socketio = require('socket.io');

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.bodyParser());
app.use(express.cookieParser(''));
app.use(express.session(
	{store: new MongoStore({url: db.url}), secret: secret})); 


app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

app.use(express.static(__dirname + '/public/'));

app.get('/lobby', function(req, res){
  res.render('lobby');
});

app.post('/newgame', function(req, res) {
  req.session.games.push([req.body.gamepass]);
  res.redirect('/');
}
);

var server = http.createServer(app);
server.listen(port);

console.log('http server listening on %d', port);

socketio.listen(server).on('connection', function (socket) {
	socket.on('my other event', function (msg) {
	console.log('Message Received: ', msg);
	socket.broadcast.emit('message', msg);
	});
});
