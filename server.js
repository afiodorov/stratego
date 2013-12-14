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

io.set('log level', 1);
console.log('http server listening on %d', port);

var clients = Object.create(null);

function genUniquePlayerName(data) {
	var key = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	do {
		key = "";
		for(var i=0; i<7; i++) {
			key += possible.charAt(Math.floor(Math.random() * possible.length));
	 	}
	} while (key in data);

	return key;
};

sessionSockets.on('connection', function (err, socket, session) {
	socket.sid = session.id;

	var onlineClients = io.sockets.clients();
	var isDuplicate = false
	onlineClients.forEach(function(client) {
		if ((client.id !== socket.id) && client.sid === socket.sid) {
			// TODO handle this gracefully
			// break the loop as well for efficiency!
			isDuplicate = true;
			console.log("duplicate client");
		}
	});

	if(!isDuplicate) {
	if(typeof session.playerName === 'undefined') {
		session.playerName = genUniquePlayerName(clients);
		session.save();
	}
	
	clients[session.playerName] = session.id;
	socket.broadcast.emit('addNewPlayer', {playerName: session.playerName,
		isSelf: false});

	onlineClients.forEach(function(client) {
		var isSelf = (client.sid === socket.sid);
		mongoStore.get(client.sid, function(err, session) {
			socket.emit('addNewPlayer', {playerName:
			session.playerName, isSelf: isSelf});
		});
	});

	socket.on('setPlayerName', function(data) {
		if(data.playerName in clients) {
			socket.emit('fChangedPlayerName');	
		} else {
			delete clients[session.playerName];
			io.sockets.emit('removePlayerName', session.playerName);

			session.playerName = data.playerName;
			session.save();
			clients[session.playerName] = session.id;
			socket.broadcast.emit('addNewPlayer', {playerName: session.playerName, 
					isSelf: false});
			socket.emit('addNewPlayer', {playerName:
				session.playerName, isSelf: true});
		}
	});

	socket.on('disconnect', function(socket) {
		delete clients[session.playerName];
		io.sockets.emit('removePlayerName', session.playerName);
	});

	}
});
