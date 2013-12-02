var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports.mongoose = mongoose;
module.exports.Schema = Schema;

connect();

// Connect to mongo
function connect() {
  var url = process.env.MONGOLAB_URI ||
  process.env.MONGOHQ_URL ||
  'mongodb://localhost/mydb';
  mongoose.connect(url);
}

function disconnect() {mongoose.disconnect()}
