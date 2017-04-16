var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var messageSchema = new Schema({
	dialogId: String,
	senderId: String,
	sender: String,
	message: String,
	fileUrl: String,
	fileSize: Number,
	date: {type: Date},
});

var message = mongoose.model('message', messageSchema);

module.exports = message;