var port = process.env.PORT || 3000;

var connect = require('connect');
connect.createServer(
    connect.static(__dirname + '/public')
).listen(port);
