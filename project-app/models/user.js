var mongoose = require('mongoose');
var SurveyResponseSchema = require('./surveyresponse').schema;

var UserSchema = new mongoose.Schema({
  name: String,
  username: String,
  password_hash: { type: String, select: false },
  survey_response: [SurveyResponseSchema]
});

var User = mongoose.model('User', UserSchema);
module.exports = User;