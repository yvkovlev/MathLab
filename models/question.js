var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var questionSchema = new Schema({
	question: String,
	answer: String
});

var question = mongoose.model('question', questionSchema);

module.exports = question;