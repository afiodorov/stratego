var db = require('../lib/db');

var StringSchema = new db.Schema({
    string : {type: String}
});

var MyString = db.mongoose.model('String', StringSchema);

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

module.exports = {
  addString : addString,
  find: function(callback) {
    MyString.find().sort('_id', 'descending').limit(5).exec(callback);
  },
};
