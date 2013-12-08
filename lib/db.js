var mongoose = require('mongoose');
var argv = require('optimist').argv;

var Schema = mongoose.Schema;

module.exports.mongoose = mongoose;
module.exports.Schema = Schema;

function connect() {
  var url = process.env.MONGOLAB_URI ||
  process.env.MONGOHQ_URL ||
  argv.MONGOLAB_URI ||
  'mongodb://localhost/mydb';
  mongoose.connect(url);
}
connect();

function disconnect() {mongoose.disconnect();}
