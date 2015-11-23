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
  // Show dashboard
  var viewDashboard = function() {
    $('#display-container').empty();
    $('#logout-btn').show();
    $('#login-btn').hide();
    $('#signup-btn').hide();
    $('#user-profile-btn').show();
    $('#view-survey-btn').show();
    $('#new-survey-btn').show();
    $('#view-dashboard-btn').hide();
    $('#analytics-btn').show();
    // Display new and view buttons. And then calls getSurveys function
  };

  // 4a.getSurveys
  // get ALL surveys
  var getSurveys = function() {
    $.get('/surveys').done(function(data) {
      renderSurveys(data)
      console.log(data)
    });
  };

  // 4b. renderSurveys
  // render ALL surveys
  var renderSurveys = function(data) {
    var template = Handlebars.compile($('#display-survey-template').html());
    for(var i=0;i<data.length;i++) {
      $('#display-container').append(template(data[i]));
    };
  };

  // 5. New Survey
  // User submits new survey
  // 5a. renderSurveyForm
  // renders form to create survey
  var renderSurveyForm = function(){
    $('#display-container').empty();
    $('#new-survey-btn').hide();
    $('#view-dashboard-btn').show()
    var template = Handlebars.compile($('#new-survey-template').html());
    $('#display-container').append(template);
  };

// 5b. createSurveyResponse
// Sends post request with survey form data
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

  // sending post request
  // document.cookie is irrelevant.  It grabs the user's _id from the cookie on the server side
    $.ajax({
      url: "http://localhost:3000/surveys",
      method: "POST",
      data: surveyResponseData
    }).done(viewDashboard);
    // directs to dashboard
  }

  // 6. showUserSurveys
  // Gets a user's individual surveys
  // 6a. getUserSurvey
  var getUserSurveys = function(data) {
    $.get('/user/surveys').done(function(data) {
      renderUserSurveys(data);
    });
  };
  // 6b.renderUserSurveys
  // renders the user's individual surveys and also attaches "view" and "edit" listeners
  var renderUserSurveys = function(data) {
    $('#display-container').empty();
    $('#view-survey-btn').hide();
    $('#new-survey-btn').show();
    $('#view-dashboard-btn').show();
    // Compiling display template for surveys
    var template = Handlebars.compile($('#display-user-template').html());
      for (var i=0;i<data.length;i++) {
        $('#display-container').append(template(data[i]));
        // adding event listener to view survey button
        var link = $('.view-survey').last();
        console.log(link);
        link.click(function() {
          // grab id from parent element
          var id = $(this).parent().attr('data-id');
          console.log(id);
          getUserViewSurvey(id);
        });
      };
    // View survey listener and call viewSurvey
  };

// 7. userViewSurvey
// Views a specific survey of of the user
// 7a. getUserViewSurvey
// Gets that specific survey
  var getUserViewSurvey = function(id) {
    $.get('/surveys/'+ id).done(function(data) {
      renderUserViewSurvey(data);
      console.log(data);
    });
  };

// 7b. renderUserViewSurvey
// renders that specific survey
  var renderUserViewSurvey = function(data) {
    $('#display-container').empty();
    $('#view-survey-btn').show();
    $('#new-survey-btn').show();
    $('#view-dashboard-btn').show();
    // Compiling template for specific survey
    var template = Handlebars.compile($('#view-user-survey-template').html());
    $('#display-container').append(template(data));
    var link = $('.edit-survey');
    // add eventlistener to edit survey
    link.click(function() {
      var id = $(this).parent().attr('data-id');
      console.log(id);
      getUserEditSurvey(id);
    });
  };

//8. userEditSurvey
// 8a. getUserEditSurvey
// Gets survey data to display for edit form
  var getUserEditSurvey = function(id) {
    $.get('/surveys/'+ id).done(function(data) {
      renderUserEditSurvey(data);
      console.log(data);
    });
  };

// 8b. render User Edit form
  var renderUserEditSurvey = function(data){
    $('#display-container').empty();
    $('#view-survey-btn').show();
    $('#new-survey-btn').show();
    $('#view-dashboard-btn').show();
    // Handlebars compiling template for editing survey
    var template = Handlebars.compile($("#survey-edit-template").html());
    $('#display-container').append(template(data));
    // Event listener to subment edit
    $('.edit-survey-submit').click(function() {
      updateSurveyResponse();
    });
  };

// 8c. Put request with survey edit form
// Grabbing form values
  var updateSurveyResponse = function() {
    var date = $("input[name='date']").val();
    var id = $("input[name='_id']").val();
    var teaching_quality = $("input[name='teaching_quality']").val();
    var comfort_level = $("input[name='comfort_level']").val();
    var lesson_score = $("input[name='lesson_score']").val();
    var comments = $("input[name='comments']").val();
    var feeling = $("input[name='feeling']").val();
    var happy_hr_suggestion = $("input[name='happy_hr_suggestion']").val();

    // setting data object for ajax
    var surveyUpdateData = {
      date: date,
      teaching_quality: teaching_quality,
      comfort_level: comfort_level,
      lesson_score: lesson_score,
      comments: comments,
      feeling: feeling,
      happy_hr_suggestion: happy_hr_suggestion,
    };
    // sending put request with object data
    $.ajax({
      url: "http://localhost:3000/surveys/"+id,
      method: "PUT",
      data: surveyUpdateData
    }).done(getUserSurveys);
  };

  // 9. View user's account/profile
  // 9a. getUserProfile (Malina)
  var getUserProfile = function(id) {
    var id = $(this).attr('data-id');
    $.get('/users/' + id).done(function(data) {
      renderUserProfile(data);
    });
  };

  // 9b. renderUserProfile (Malina)
  var renderUserProfile = function(data) {
    $('#display-container').empty();
    $('#view-dashboard-btn').show();
    var template = Handlebars.compile($("#user-profile-template").html());
    $('#display-container').append(template(data));
  };

  // 10. Make changes and update user's profile
  // 10a. editUserProfile
  var editUserProfile = function() {
    $('#display-container').empty();
    var template = Handlebars.compile($('#edit-user-profile-template').html());
    $('#display-container').append(template);
  };

  // 10b. updateUserProfile
  var updateUserProfile = function() {
    userId = Cookies.get('loggedInId');
    var nameInput = $("input[name='name']").val();
    var usernameInput = $("input[name='username']").val();
    var passwordInput = $("input[name='password']").val();
    var user = {
      name: nameInput,
      username: usernameInput,
      password: passwordInput
    }
    $.ajax({
      url: "http://localhost:3000/users/" + userId,
      method: "PUT",
      data: user
    }).done(renderUserProfile(user));
  };

  // 11. deleteUserProfile
  var deleteUserProfile = function() {
    user = Cookies.get('loggedInId');
    $.ajax({
      url: "http://localhost:3000/users/" + user,
      method: "DELETE",
      data: 'json'
    }).done(Cookies.remove('loggedInId'));
    window.location = '/';
  };

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
  $('body').on('click', '#new-survey-btn', renderSurveyForm);
  // 4b. Submit new survey > submitNewSurvey
  $('body').on('click', '#survey-submit-btn', createSurveyResponse);
  // 5. Back to dashboard button > viewDashboard
  $('body').on('click', '#view-dashboard-btn', viewDashboard);
  // 6a.View my surveys > getUserSurveys
  $('body').on('click', '#view-survey-btn', getUserSurveys);
  // 6b. View individual survey > getUserViewSurvey
  // Put listener inside of renderUserSurveys to grab element id
  // 6c. Edit individual survey >getUserEditSurvey
  // Put listener inside of renderUserSurveys to grab element id
  // 6d. Submit survey update> getUserSurveys
  $('body').on('click', '#survey-submit-edit-btn', updateSurveyResponse);
  // 6e. Back to view survey > getUserViewSurvey
  // 9. View user profile > getUserProfile
  $('body').on('click', '#user-profile-btn', getUserProfile);
  // 10a. Edit user profile > editUserProfile
  $('body').on('click', '#edit-user-profile-btn', editUserProfile);
  // 10b. Update user profile > updateUserProfile
  $('body').on('click', '#edit-user-submit-btn', updateUserProfile);
  // 11. Delete user profile > deleteUserProfile
  $('body').on('click', '#delete-user-profile-btn', deleteUserProfile);

  // If user is logged in, go directly to dashboard
  if (document.cookie) {
    viewDashboard();
  };

});