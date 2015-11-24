var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var md5 = require('md5');
var cookieParser = require('cookie-parser');
var port = process.env.PORT || 3000;
var express = require('express');
var app = express();
var emoji = require('node-emoji');

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
  // Adding conditional checking res.cookies?
  SurveyResponse.find().then(function(data) {
    res.send(data);
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

// View form
app.get('/user/surveys', function(req,res){
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
    if(err) {
      console.log(err)
    } else {
      res.send(survey);
    }  
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