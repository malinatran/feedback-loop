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

// Sign up new user (Malina)
app.post('/users', function(req, res) {
  password_hash = md5(req.body.password);
  var user = new User({
    name: req.body.name,
    username: req.body.username,
    password_hash: password_hash,
    forms: []
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

// Login user (Malina)
app.post('/login', function(req, res) {
  User.findOne({
    username: req.body.username,
    password_hash: md5(req.body.password)
  }, function(err, user) {
    res.cookie('loggedInId', user.id);
    res.send(user);
  });
});

// Show all forms (Peter)
app.get('/surveys', function(req, res){
  // add conditional checking res.cookies?
  SurveyResponse.find().then(function(data){
    res.send(data)
  })

})

// Create surveyResponse (Peter)
app.post('/users/:id/surveys', function(req, res){
  console.log(req.cookies.loggedInId)

  User.findById(req.cookies.loggedInId).then(function(user) {

    var survey = new SurveyResponse({
    date: req.body.date,
    teaching_quality: req.body.teaching_quality,
    comfort_level: req.body.comfort_level,
    lesson_score: req.body.lesson_score,
    comments: req.body.comments,
    feeling: req.body.feeling,
    happy_hr_suggestion: req.body.happy_hr_suggestion,
    user: req.cookies.loggedInId,
    });

    // Not pushing to user for some reason...
    user.survey_response.push(survey)

    console.log(survey)

    survey.save(function(err) {
    if(err) {
      console.log(err);
    } else {
      console.log(survey + 'created')
      res.send(
        "New Survey Created!"
      )
    }
  });
    // })
  });
})

// View form (Peter)

// Edit form (Peter)

// Delete form (Peter)







