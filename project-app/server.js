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
      console.log('User created');
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
  var dates_array = [];
  var check_dates_array = function(input){
    for (var i = 0; i < dates_array.length; i++) {
      if ( JSON.stringify(input) == JSON.stringify(dates_array[i].date)) {
        return false;
      }
    };
    return true;
  };
  SurveyResponse.find().then(function(data) {
    for (var i = 0; i < data.length; i++) {
      if (check_dates_array(data[i].date)) { 
         dates_array.push(data[i])
      } 
    };
    res.send(dates_array);
  });
});

// Create survey response
app.post('/surveys', function(req, res) {
// Finding user using cookies
  User.findById(req.cookies.loggedInId, function(err,user) {
    if (err) {
      console.log(err);
    } else {
      console.log(user.survey_responses);
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
        console.log(survey + 'created');
        res.send(survey);
      });
    };
  });
});

// View form (Peter)
app.get('/user/surveys', function(req,res) {
  // Grabbing user_id from cookies
  user_id_pull = req.cookies.loggedInId;
  console.log(user_id_pull);
  // Finding responses w/ user id
  SurveyResponse.find({"user": user_id_pull}).then(function(surveys) {
    console.log("get surveys");
    console.log(surveys);
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
  surveys_array = []
  // Convert date to string
  pull_date = JSON.stringify(req.params.date)
  // Find all surveys. Compares stringified date to pull_date. Pushes correct object to array
  SurveyResponse.find().then(function(data) {
    for (var i = 0; i < data.length; i++) {
      console.log(JSON.stringify(data[i].date))
      if(JSON.stringify(data[i].date)==pull_date){
        surveys_array.push(data[i])
      }
    };
  console.log(surveys_array)
  // empty arrays for making new object
  var comments_array = [];
  var feeling_array = [];
  var happy_hr_suggestion_array = [];
  var teaching_quality_array = [];
  var comfort_level_array = [];
  var lesson_score_array = [];
  // Pushes all values to specific arrays
  for (var i=0; i<surveys_array.length; i++){
      comments_array.push(surveys_array[i].comments)
  };
  for (var i=0; i<surveys_array.length; i++){
      feeling_array.push(surveys_array[i].feeling)
  };
  for (var i=0; i<surveys_array.length; i++){
      happy_hr_suggestion_array.push(surveys_array[i].happy_hr_suggestion)
  };
  for (var i=0; i<surveys_array.length; i++){
    teaching_quality_array.push(surveys_array[i].teaching_quality)
  };
  for (var i=0; i<surveys_array.length; i++){
      comfort_level_array.push(surveys_array[i].comfort_level)
  };
  for (var i=0; i<surveys_array.length; i++){
      lesson_score_array.push(surveys_array[i].lesson_score)
  };

  // Average function
  var average = function(array){
    sum = 0
    for (var i = 0; i <array.length; i++) {
      sum += array[i]
    };
    mean = sum/array.length
    return mean
  }

  // Create object with averages and individual arrays
  var object = {
    surveys_completed: surveys_array.length,
    teaching_avg: average(teaching_quality_array),
    comfort_avg: average(comfort_level_array),
    lesson_avg: average(lesson_score_array),
    comments: comments_array,
    feeling: feeling_array,
    happy_hr_suggestion: happy_hr_suggestion_array,
    teaching_quality: teaching_quality_array,
    comfort_level: comfort_level_array,
    lesson_score: lesson_score_array,
  }
  res.send(object);
  }); 
});
















