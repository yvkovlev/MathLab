var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  fullName: String,
  login: String,
  email: String,
  password: String,
  phone: String,
  sex: Boolean, // 0 - Male, 1 - Female
  grade: Number,
  confirmed: Boolean
});

var user = mongoose.model('user', userSchema);

module.exports = user;