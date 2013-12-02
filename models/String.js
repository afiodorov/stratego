var db = require('../lib/db');

var StringSchema = new db.Schema({
    string : {type: String}
})

var MyString = db.mongoose.model('String', StringSchema);

// Exports
module.exports.addString = addString;

// Add string to database
function addString(string, callback) {
  var instance = new MyString();
  instance.string = string;
  instance.save(function (err) {
    if (err) {
      callback(err);
    }
    else {
      callback(null, instance);
    }
  });
}
