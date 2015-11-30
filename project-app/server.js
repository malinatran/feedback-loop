var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var md5 = require('md5');
var cookieParser = require('cookie-parser');
var port = process.env.PORT || 3000;
var express = require('express');
var app = express();
var Yelp = require('yelp');
var yelp = new Yelp({
  consumer_key: process.env.YELP_CONSUMER_KEY,
  consumer_secret: process.env.YELP_CONSUMER_SECRET,
  token: process.env.YELP_TOKEN,
  token_secret: process.env.YELP_TOKEN_SECRET
});

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
  email_hash = md5(req.body.email);
  var user = new User({
    name: req.body.name,
    username: req.body.username,
    email: req.body.email,
    email_hash: email_hash,
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
    if(!user){
      console.log('error');
      res.send(false);
    }else{
      res.cookie('loggedInId', user.id);
      res.send(true);
    };
  });
});

// Show all forms
app.get('/surveys', function(req, res) {
  var survey_responses = [];
  var check_survey_responses = function(input){
    for (var i = 0; i < survey_responses.length; i++) {
      if ( JSON.stringify(input) == JSON.stringify(survey_responses[i].date)) {
        return false;
      };
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
      // Setting survey object
      var survey = new SurveyResponse({
        date: req.body.date,
        teaching_quality: req.body.teaching_quality,
        comfort_level: req.body.comfort_level,
        lesson_score: req.body.lesson_score,
        comments: req.body.comments,
        feeling: req.body.feeling,
        happy_hr_suggestion_id: req.body.selected_business,
        happy_hr_suggestion_name: req.body.selected_business_name,
        user: req.cookies.loggedInId
      });
      // Saving survey
      survey.save(function(err, survey) {
        var business_id = survey.happy_hr_suggestion_id
        yelp.business(business_id, function(err, data) {
          console.log(data)
          if (err) {
            var business = null;
          } else {
            var business = data;
          };
          res.send({
            survey: survey,
            business: business
          });
        });
      });
    };
  });
});

// View form
app.get('/user/surveys', function(req,res) {
  // Grabbing user_id from cookies
  var user_id_pull = req.cookies.loggedInId;
  // Finding responses w/ user id
  SurveyResponse.find({"user": user_id_pull}).sort('-date').exec(function(err, surveys) {
    res.send(surveys);
  });
});

// Get individual survey
app.get('/surveys/:id', function(req,res){
  SurveyResponse.findOne({"_id": req.params.id}).then(function(survey) {
    var business_id = survey.happy_hr_suggestion_id;
    yelp.business(business_id, function(err, data) {
      if (err) {
        var business = null;
      } else {
        var business = data;
      };
      res.send({
        survey: survey,
        business: business
      });
    });
  });
});

// Edit individual survey
app.put('/surveys/:id', function(req,res) {
  SurveyResponse.findOneAndUpdate({"_id": req.params.id}, {
    teaching_quality: req.body.teaching_quality,
    comfort_level: req.body.comfort_level,
    lesson_score: req.body.lesson_score,
    comments: req.body.comments,
    feeling: req.body.feeling,
    happy_hr_suggestion_id: req.body.selected_business,
    happy_hr_suggestion_name: req.body.selected_business_name,
    user: req.cookies.loggedInId
  }, function(err, survey) {
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
  email_hash = md5(req.body.email);
  var user = {
    name: req.body.name,
    username: req.body.username, 
    email: req.body.email,
    email_hash: email_hash,
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
      teaching_quality: teaching_quality_array,
      comfort_level: comfort_level_array,
      lesson_score: lesson_score_array,
      surveys: surveys_array
    }
    res.send(object);
  }); 
});

app.post('/surveys/:id/like', function(req, res) {
  SurveyResponse.findByIdAndUpdate({ _id: req.params.id }, {$inc: {happy_hr_suggestion_likes: 1}}, function (err, data) {
    res.send(true);
  });
});

app.post('/surveys/:id/dislike', function(req, res) {
  SurveyResponse.findByIdAndUpdate({ _id: req.params.id }, {$inc: {happy_hr_suggestion_dislikes: 1}}, function (err, data) {
    res.send(true);
  });
});

app.get('/businesses/:find/:near', function(req, res) {
  yelp.search({ term: req.params.find, location: req.params.near })
    .then(function (data) {
      res.send(data.businesses);
    })
    .catch(function (err) {
      console.error(err);
    });
});

app.get('/check/:date', function(req, res){
  var pull_date = req.params.date
  var pull_user_id = req.cookies.loggedInId;
  SurveyResponse.find({"user": pull_user_id}).exec(function(err, data){
    var check_data = function(input){
    for (var i = 0; i < input.length; i++) {
      var data_date_ms = (data[i].date).getTime();
      if( data_date_ms == pull_date){
        return false
      }
    };
    return true
    }; 
    res.send(check_data(data))
  })
})






