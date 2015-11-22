console.log('test');

// Setting global user variable to later assign cookies to
var user = null;

$(function() {

  // MVP FUNCTIONS
  // 1. Login user
  // 1a. renderLoginForm
  var renderLoginForm = function() {
    $('#display-container').empty();
    $('#login-btn').hide();
    $('#signup-btn').hide();
    var template = Handlebars.compile($('#login-template').html());
    $('#display-container').append(template);
  };

  // 1b. submitLoginForm
  var submitLoginForm = function() {
    var usernameInput = $("input[name='username']").val();
    var passwordInput = $("input[name='password']").val();
    var user = {
      username: usernameInput,
      password: passwordInput
    };
    $.ajax({
      url: '/login',
      method: 'POST',
      dataType: 'json',
      data: user
    }).done(viewDashboard);
  };

  // 2. Create a new user
  // 2a. renderSignupForm
  // Hide buttons, compile Handlebars template
  var renderSignupForm = function() {
    $('#display-container').empty();
    $('#login-btn').hide();
    $('#signup-btn').hide();
    var template = Handlebars.compile($('#signup-template').html());
    $('#display-container').append(template);
  };

  // 2b. submitSignupForm
  // Create user obj, send through Ajax POST req
  var submitSignupForm = function() {
    var nameInput = $("input[name='name']").val();
    var usernameInput = $("input[name='username']").val();
    var passwordInput = $("input[name='password']").val();
    var user = {
      name: nameInput,
      username: usernameInput,
      password: passwordInput
    }
    $.post('/users', user).done(createUser);
  };

  // 2c. createUser
  // Set Cookies to the user's ID
  var createUser = function() {
    user = Cookies.get('loggedInId');
    viewDashboard();
  };

  // 3. logoutUser
  // Logging out on the client side
  var logoutUser = function() {
    Cookies.remove('loggedInId');
    // Returns to homepage after logout:
    window.location = '/';
  };

  // 4. viewDashboard
  var viewDashboard = function() {
    console.log(document.cookie)
    console.log("viewDashboard")
    $('#display-container').empty();
    $('#logout-btn').show();
    $('#login-btn').hide();
    $('#signup-btn').hide();
    $('#view-survey-btn').show();
    $('#new-survey-btn').show();
    $('#view-dashboard').hide()
    getSurveys();
    // Display new and view buttons.  And then calls findSurveys function
  };

  // 4a.findSurveys
  var getSurveys = function(){
    $.get('/surveys').done(function(data){
      renderSurveys(data)
      console.log(data)
    })
  }

  var renderSurveys = function(data){
    var template = Handlebars.compile($('#display-survey-template').html());
    for(var i=0;i<data.length;i++) {
    $('#display-container').append(template(data[i]))
  }
  }


  // 5. New Survey
  // 5a. renderSurveyForm
  var renderSurveyForm = function(){
   
    // console.log("hello")
    $('#display-container').empty();
    $('#new-survey-btn').hide();
    $('#view-dashboard').show()
    var template = Handlebars.compile($('#new-survey-template').html());
    $('#display-container').append(template);
  }

// 5b. createSurveyResponse
  var createSurveyResponse = function(){
    console.log('ajax to create instructors')
    // console.log(document.cookie.value)
    // pulling values from form and cookie
    // console.log(id)
    var date = $("input[name='date']").val();
    var teaching_quality = $("input[name='teaching_quality']").val();
    var comfort_level = $("input[name='comfort_level']").val();
    var lesson_score = $("input[name='lesson_score']").val();
    var comments = $("input[name='comments']").val();
    var feeling = $("input[name='feeling']").val();
    var happy_hr_suggestion = $("input[name='happy_hr_suggestion']").val();

    // setting data object for ajax
    var surveyResponseData = {
      date: date,
      teaching_quality: teaching_quality,
      comfort_level: comfort_level,
      lesson_score: lesson_score,
      comments: comments,
      feeling: feeling,
      happy_hr_suggestion: happy_hr_suggestion,
    };

  // sending request
    $.ajax({
      url: "http://localhost:3000/users/"+document.cookie+"/surveys",
      method: "POST",
      data: surveyResponseData
    }).done();
  }
  // CLICK FUNCTIONS
  // 1a. Login button > renderLoginForm
  $('#login-btn').on('click', renderLoginForm);
  // 1b. Login submit button > submitLoginForm
  $('body').on('click', '#login-submit-btn', submitLoginForm);
  // 2a. Signup button > renderSignupForm
  $('#signup-btn').on('click', renderSignupForm);
  // 2b. Signup submit button > submitSignupForm
  $('body').on('click', '#signup-submit-btn', submitSignupForm);
  // 3. Logout button > logoutUser
  $('body').on('click', '#logout-btn', logoutUser);
  // 4a. New Survey button > renderSurveys
  $('#new-survey-btn').on('click', renderSurveyForm);
  // 4b. Submit new survey > submitNewSurvey
  $('body').on('click', '#survey-submit-btn', createSurveyResponse);
  // 5. Back to dashboard button > viewDashboard
  $('#view-dashboard').on('click', viewDashboard);


  // If user is logged in, go directly to dashboard
  if (document.cookie) {
    viewDashboard();
  };

  // 

});