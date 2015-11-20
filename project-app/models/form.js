var mongoose = require('mongoose');

var FormSchema = new mongoose.Schema({
  date: Date,
  teaching_quality: Number,
  comfort_level: Number,
  lesson_score: Number,
  comments: String,
  feeling: String,
  happy_hr_suggestion: String,
  user: { type: mongoose.Schema.Types.ObjectId, re: 'User' },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

var Form = mongoose.model('Form', FormSchema);
module.exports = Form;