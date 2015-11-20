var mongoose = require('mongoose');
var FormSchema = require('./form').schema;

var UserSchema = new mongoose.Schema({
  name: String,
  username: String,
  password_hash: { type: String, select: false },
  forms: [FormSchema]
});

var User = mongoose.model('User', UserSchema);
module.exports = User;