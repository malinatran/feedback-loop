var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var md5 = require('md5');
var cookieParser = require('cookie-parser');
var port = process.env.PORT || 3000;
var express = require('express');
var app = express();

// Models
var User = require('./models/user.js');
var SurveyResponse = require('./models/surveyresponse.js');

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(cookieParser());

// Database
mongoose.connect('mongodb://localhost/feedbackloop');

// Listener
app.listen(port);

// Sign up new user
app.post('/users', function(req, res) {
  password_hash = md5(req.body.password);
  var user = new User({
    name: req.body.name,
    username: req.body.username,
    password_hash: password_hash,
  });
  user.save(function(err) {
    if (err) {
      console.log(err);
      res.statusCode = 503;
    } else {
      // User is logged in until user explicitly clicks logout, even if page is refreshed or window is closed
      // maxAge is set to one year
      res.cookie('loggedInId', user.id, { maxAge:31556952000 }).send(user);
    }
  });
});

// Login user
app.post('/login', function(req, res) {
  User.findOne({
    username: req.body.username,
    password_hash: md5(req.body.password)
  }, function(err, user) {
    res.cookie('loggedInId', user.id);
    res.send(user);
  });
});

// Show all forms
app.get('/surveys', function(req, res) {
  var survey_responses = [];
  var check_survey_responses = function(input){
    for (var i = 0; i < survey_responses.length; i++) {
      if ( JSON.stringify(input) == JSON.stringify(survey_responses[i].date)) {
        return false;
      }
    };
    return true;
  };
  SurveyResponse.find().sort('-date').exec(function(err,data) {
    for (var i = 0; i < data.length; i++) {
      if (check_survey_responses(data[i].date)) { 
        survey_responses.push(data[i]);
      } 
    };
    res.send(survey_responses);
  });
});

// Create survey response
app.post('/surveys', function(req, res) {
  // Finding user using cookies
  User.findById(req.cookies.loggedInId, function(err,user) {
    if (err) {
      console.log(err);
    } else {
      console.log(user.survey_responses)
      // Setting survey object
      var survey = new SurveyResponse({
        date: req.body.date,
        teaching_quality: req.body.teaching_quality,
        comfort_level: req.body.comfort_level,
        lesson_score: req.body.lesson_score,
        comments: req.body.comments,
        feeling: req.body.feeling,
        happy_hr_suggestion: req.body.happy_hr_suggestion,
        user: req.cookies.loggedInId
      });
      // Saving survey
      survey.save(function(err) {
        res.send(survey);
      });
    };
  });
});

// View form
app.get('/user/surveys', function(req,res) {
  // Grabbing user_id from cookies
  user_id_pull = req.cookies.loggedInId;
  console.log(user_id_pull);
  // Finding responses w/ user id
  SurveyResponse.find({"user": user_id_pull}).sort('-date').exec(function(err, surveys) {
    res.send(surveys);
  });
});

// Get individual survey
app.get('/surveys/:id', function(req,res){
  console.log(req.params.id);
  SurveyResponse.findOne({"_id": req.params.id}).then(function(survey) {
    res.send(survey);
  });
});

// Edit form
app.put('/surveys/:id', function(req,res) {
  SurveyResponse.findOneAndUpdate({"_id": req.params.id}, req.body, function(err, survey) {
    if (err) {
      console.log(err)
    } else {
      res.send(survey);
    };  
  });
});

// View user account
app.get('/users/:id', function(req, res) {
  User.findById(req.cookies.loggedInId, function(err, user) {
    res.send(user);
  });
});

// Edit user account
app.put('/users/:id', function(req, res) {
  password_hash = md5(req.body.password);
  var user = {
    name: req.body.name,
    username: req.body.username, 
    password_hash: password_hash 
  };
  User.findOneAndUpdate(req.cookies.loggedInId, user, function(err, user) {
    res.send(user);
  });
});

// Delete user account
app.delete('/users/:id', function(req, res) {
  User.findByIdAndRemove(req.cookies.loggedInId, function(err, user) {
    console.log('User deleted');
  });
});

// Get surveys for specific date, manipulate data, return object with manipulated data
app.get('/analytics/:date', function(req, res) {
  var surveys_array = [];
  // Convert date to string
  var pull_date = JSON.stringify(req.params.date);
  // Find all surveys. Compares stringified date to pull_date. Pushes correct object to array
  SurveyResponse.find().then(function(data) {
    for (var i = 0; i < data.length; i++) {
      if (JSON.stringify(data[i].date)==pull_date){
        surveys_array.push(data[i])
      }
    };
  // empty arrays for making new object
  var comments_array = [];
  var randomized_comments= [];
  var feeling_array = [];
  var randomized_feeling = [];
  var happy_hr_suggestion_array = [];
  var teaching_quality_array = [];
  var comfort_level_array = [];
  var lesson_score_array = [];
  // Pushes all values to specific arrays
  for (var i=0; i < surveys_array.length; i++) {
    comments_array.push(surveys_array[i].comments);
  };
  for (var i=0; i < surveys_array.length; i++) {
    feeling_array.push(surveys_array[i].feeling);
  };
  for (var i=0; i < surveys_array.length; i++) {
    happy_hr_suggestion_array.push(surveys_array[i].happy_hr_suggestion);
  };
  for (var i=0; i < surveys_array.length; i++) {
    teaching_quality_array.push(surveys_array[i].teaching_quality);
  };
  for (var i=0; i < surveys_array.length; i++) {
    comfort_level_array.push(surveys_array[i].comfort_level);
  };
  for (var i=0; i < surveys_array.length; i++) {
    lesson_score_array.push(surveys_array[i].lesson_score);
  };
  // Average function
  var average = function(array) {
    sum=0;
    for (var i=0; i <array.length; i++) {
      sum += array[i];
    };
    mean=sum/array.length;
    return mean.toFixed(2);
  };
  // shuffle comments
  comments_length = comments_array.length
  for (var i = 0; i < comments_length; i++){    
    randomized_comments[i] = comments_array.splice(Math.floor(Math.random() * comments_array.length), 1)[0];
  };
  // shuffle feelings
  feeling_length = feeling_array.length
  for (var i = 0; i < feeling_length; i++){    
    randomized_feeling[i] = feeling_array.splice(Math.floor(Math.random() * feeling_array.length), 1)[0];
  };
  // Create object with averages and individual arrays
  var object = {
    date: JSON.parse(pull_date),
    surveys_completed: surveys_array.length,
    teaching_avg: average(teaching_quality_array),
    comfort_avg: average(comfort_level_array),
    lesson_avg: average(lesson_score_array),
    comments: randomized_comments,
    feeling: randomized_feeling,
    happy_hr_suggestion: happy_hr_suggestion_array,
    teaching_quality: teaching_quality_array,
    comfort_level: comfort_level_array,
    lesson_score: lesson_score_array,
  }
  res.send(object);
  }); 
});
















