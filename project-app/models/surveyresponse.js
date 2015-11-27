 var mongoose = require('mongoose');

var SurveyResponseSchema = new mongoose.Schema({
  date: Date,
  teaching_quality: Number,
  comfort_level: Number,
  lesson_score: Number,
  comments: String,
  feeling: String,
  happy_hr_suggestion: String,
  happy_hr_suggestion_likes: { type: Number, default: 0 }, 
  user: { type: mongoose.Schema.Types.ObjectId, re: 'User' },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

var SurveyResponse = mongoose.model('SurveyResponse', SurveyResponseSchema);
module.exports = SurveyResponse;