var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  fullname: String,
  email: String,
  password: String,
  phone: String,
  sex: String, // 0 - Male, 1 - Female
  grade: String,
  confirmed: Boolean,
  priority: Number // 0 - student, 1 - teacher, 2 - admin
});

var User = mongoose.model('User', userSchema);

module.exports = User;