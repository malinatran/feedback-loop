var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var md5 = require('md5');
var cookieParser = require('cookie-parser');
var port = process.env.PORT || 3000;
var express = require('express');
var app = express();

// Models
var User = require('./models/user.js');
var Form = require('./models/form.js');

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(cookieParser());

// Database
mongoose.connect('mongodb://localhost/ga-classroom');

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

// Show form (Peter)

// View form (Peter)

// Edit form (Peter)

// Delete form (Peter)