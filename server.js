var secret = 'someThinWeirdAsdflk';
var WebSocketServer = require('ws').Server
  , http = require('http')
  , express = require('express')
  , app = express()
  , port = process.env.PORT || 5000
  , parseCookie = express.cookieParser(secret)
  , MyString = require('./models/String.js')
  , MongoStore = require('connect-mongo')(express)
  , db = require('./lib/db.js');

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  app.use(express.bodyParser());
  app.use(express.cookieParser(''));
  app.use(express.session({
    store: new MongoStore({
      url: db.url
    }),
    secret: secret
  }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

app.use(express.static(__dirname + '/public/'));

app.post('/push', function(req, res) {
  var string = req.body.string;
  MyString.addString(string, function(err) {
    if (err) {
    	    console.log("db error");
    	    throw err;
    }
    res.redirect('/');
  });
});

app.get('/newgame', function(req, res) {
  req.session.games = ['a', 'b'];
  res.redirect('/');
}
);

var server = http.createServer(app);
server.listen(port);

console.log('http server listening on %d', port);

var wss = new WebSocketServer({server: server});
console.log('websocket server created');
wss.on('connection', function(ws) {
    parseCookie(ws.upgradeReq, null, function(err) {
        var sessionID = ws.upgradeReq.signedCookies['connect.sid'];
        var MyMongoStore = new MongoStore({url: db.url}); 

        MyMongoStore.get(sessionID, function(err, session) {
			if(session.games) {
				session.games.forEach(function(entry){ws.send(JSON.stringify(entry));});
			} else {
				ws.send(JSON.stringify("no games"));
			}
		});
        });

    MyString.find(function(err, strings){
    	if(err) {throw err;}
    	if(strings) {
    	  strings.forEach(function(string) {
	    ws.send(JSON.stringify(string.string));
    	  });
	}
    });

    console.log('websocket connection open');

    ws.on('close', function() {
        console.log('websocket connection close');
    });
});
