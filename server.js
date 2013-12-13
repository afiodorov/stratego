var secret = process.env.SESSION_SECRET || 'someThinWeirdAsdflk';
var jade = require('jade')
  , http = require('http')
  , express = require('express')
  , app = express()
  , port = process.env.PORT || 5000
  , cookieParser = express.cookieParser(secret)
  , MyString = require('./models/String.js')
  , MongoStore = require('connect-mongo')(express)
  , db = require('./lib/db.js')
  , mongoStore = new MongoStore({url: db.url});

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
var io = require('socket.io').listen(server)
  , SessionSockets = require('session.socket.io')
  , sessionSockets = new SessionSockets(io, mongoStore, cookieParser);

console.log('http server listening on %d', port);

sessionSockets.on('connection', function (err, socket, session) {
	socket.on('startGame', function (gameName) {
		session.games = [];
		session.games.push(gameName);
		session.save();
		console.log(session);
		socket.emit('game started', gameName);
	});
});
