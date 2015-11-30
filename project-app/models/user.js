var mongoose = require('mongoose');
var SurveyResponseSchema = require('./surveyresponse').schema;

var UserSchema = new mongoose.Schema({
  name: String,
  username: String,
  email: String,
  email_hash: String,
  password_hash: { type: String, select: false }
});

var User = mongoose.model('User', UserSchema);
module.exports = User;