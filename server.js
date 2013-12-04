var WebSocketServer = require('ws').Server
  , http = require('http')
  , express = require('express')
  , app = express()
  , port = process.env.PORT || 5000
  , MyString = require('./models/String.js');

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  app.use(express.bodyParser());
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

var server = http.createServer(app);
server.listen(port);

console.log('http server listening on %d', port);

var wss = new WebSocketServer({server: server});
console.log('websocket server created');
wss.on('connection', function(ws) {
    var id = setInterval(function() {
        ws.send(JSON.stringify(new Date()), function(){});
    }, 1000);

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
        clearInterval(id);
    });
});
