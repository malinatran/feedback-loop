console.log('test');

// Setting global user variable to later assign cookies to
var user = null;

$(function() {

  // 0. renderHomepage
  var renderHomepage = function() {
    window.location = '/';
    $('#title').show();
    $('.lead').show();
    $('#signup-container').hide();
    $('#login-container').hide();
  };

  // 1. Login user
  // 1a. renderLoginForm
  var renderLoginForm = function() {
    $('#display-container').empty();
    $('.login-btn').hide();
    $('.signup-btn').show();
    $('#home-btn').show();
    $('#title').show();
    $('#splash-container').hide();
    $('#my-surveys-headline').hide();
    $('#analytics-headline').hide();
    $('#new-survey-headline').hide();
    $('#signup-container').hide();
    $('#login-container').show();
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
  var renderSignupForm = function() {
    $('#display-container').empty();
    $('.login-btn').show();
    $('.signup-btn').hide();
    $('#home-btn').show();
    $('#title').show();
    $('#splash-container').hide();
    $('#my-surveys-headline').hide();
    $('#analytics-headline').hide();
    $('#new-survey-headline').hide();
    $('#signup-container').show();
    $('#login-container').hide();
    var template = Handlebars.compile($('#signup-template').html());
    $('#display-container').append(template);
  };

  // 2b. submitSignupForm
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
  var createUser = function() {
    user = Cookies.get('loggedInId');
    viewDashboard();
  };

  // 3. Logout user
  var logoutUser = function() {
    Cookies.remove('loggedInId');
    window.location = '/';
    $('#title').show();
    $('.lead').show();
  };

  // 4. Display user's dashboard
  var viewDashboard = function() {
    $('#display-container').empty();
    $('#logout-btn').show();
    $('.login-btn').hide();
    $('.signup-btn').hide();
    $('#user-profile-btn').show();
    $('#view-survey-btn').show();
    $('#new-survey-btn').show();
    $('#view-analytics-btn').show();
    $('#view-dashboard-btn').hide();
    $('#home-btn').hide();
    $('#back-to-analytics').hide();
    $('#back-to-surveys').hide();
    $('#title').show();
    $('.lead').show();
    $('#splash-container').hide();
    $('#my-surveys-headline').hide();
    $('#analytics-headline').hide();
    $('#new-survey-headline').hide();
    $('#dashboard-container').show();
    $('#signup-container').hide();
    $('#login-container').hide();
    $('body').css("background-image", "url(img/backgroundcolors.jpg)");
  };

  // 4a. getSurveyDates
  // Get ALL surveys in an object, only with unique dates
  var getSurveyDates = function() {
    $.get('/surveys').done(function(data) {
      renderSurveyAnalytics(data);
    });
  };

  // 4b. renderSurveyAnalytics
  // Renders the dates on the page with an analytics button
  var renderSurveyAnalytics = function(data) {
    $('#display-container').empty();
    $('#view-survey-btn').hide();
    $('#new-survey-btn').hide();
    $('#view-analytics-btn').hide();
    $('#view-dashboard-btn').show();
    $('#title').hide();
    $('.lead').hide();
    $('#splash-container').hide();
    $('#my-surveys-headline').hide();
    $('#analytics-headline').show();
    $('#new-survey-headline').hide();
    $('#back-to-analytics').hide();
    $('#signup-container').hide();
    $('#login-container').hide();
    $('#dashboard-container').hide();
    $('body').css("background-image", "url(img/backgroundyellow.jpg)");
    var template = Handlebars.compile($('#analytics-by-date-template').html());
    for (var i=0; i < data.length; i++) {
      data[i].formattedDate = new Date(data[i].date).toDateString();
      $('#display-container').append(template(data[i]));
      var link = $('.analytics-by-date-btn').last();
      link.click(function() {
        // grab id from parent element
        var date = $(this).parent().attr('data-id');
        getAnalytics(date);
        // button calls get Analytics, which will grab relevate data for the date
        // Create new function that is called when "view analytics" is clicked
      });
    };
  };

  // 4c. getAnalytics
  // Get request with date, to grab all surveys with date object
  var getAnalytics = function(input){
    $.ajax({
      url: "http://localhost:3000/analytics/"+input,
      method: "GET",
    }).done(function(data) {
      data.formattedDate = new Date (data.date).toDateString();
      renderDateAnalytics(data);
      // receives analytics object and then calls render to put it on the page.
    });
  };

  // 4d. renderDateAnalytics
  var renderDateAnalytics = function(input) {
    $('#display-container').empty();
    $('#view-dashboard-btn').show();
    $('#back-to-surveys').hide();
    $('#back-to-analytics').show();
    $('#title').hide();
    $('.lead').hide();
    $('#splash-container').hide();
    $('#my-surveys-headline').hide();
    $('#analytics-headline').show();
    $('#new-survey-headline').hide();
    $('#signup-container').hide();
    $('#login-container').hide();
    $('#dashboard-container').hide();
    $('body').css("background-image", "url(img/backgroundyellow.jpg)");
    var template = Handlebars.compile($('#analytics-template').html());
    $('#display-container').append(template(input));
  };

  // 5. Fill out survey
  // 5a. renderSurveyForm
  var renderSurveyForm = function() {
    $('#display-container').empty();
    $('#new-survey-btn').hide();
    $('#view-survey-btn').hide();
    $('#view-dashboard-btn').show();
    $('#view-analytics-btn').hide();
    $('#title').hide();
    $('.lead').hide();
    $('#splash-container').hide();
    $('#my-surveys-headline').hide();
    $('#analytics-headline').hide();
    $('#new-survey-headline').show();
    $('#signup-container').hide();
    $('#login-container').hide();
    $('#dashboard-container').hide();
    $('body').css("background-image", "url(img/backgroundyellow.jpg)");
    var template = Handlebars.compile($('#new-survey-template').html());
    $('#display-container').append(template);
  };

  // 5b. createSurveyResponse
  var createSurveyResponse = function() {
    var date = $("input[name='date']").val();
    var teaching_quality = $("input[name='teaching_quality']").val();
    var comfort_level = $("input[name='comfort_level']").val();
    var lesson_score = $("input[name='lesson_score']").val();
    var comments = $("textarea[name='comments']").val();
    var feeling = $("input[name='feeling']").val();
    var happy_hr_suggestion = $("input[name='happy_hr_suggestion']").val();
    var surveyResponseData = {
      date: date,
      teaching_quality: teaching_quality,
      comfort_level: comfort_level,
      lesson_score: lesson_score,
      comments: comments,
      feeling: feeling,
      happy_hr_suggestion: happy_hr_suggestion,
    };
  // document.cookie is irrelevant. It grabs the user's _id from the cookie on the server side
    $.ajax({
      url: "http://localhost:3000/surveys",
      method: "POST",
      data: surveyResponseData
    }).done(viewDashboard);
  };

  // 6. View user's surveys
  // 6a. getUserSurvey
  var getUserSurveys = function(data) {
    $.get('/user/surveys').done(function(data) {
      data.formattedDate = new Date (data.date).toDateString();
      renderUserSurveys(data);
    });
  };

  // 6b.renderUserSurveys
  var renderUserSurveys = function(data) {
    $('#display-container').empty();
    $('#view-survey-btn').hide();
    $('#new-survey-btn').hide();
    $('#view-dashboard-btn').show();
    $('#view-analytics-btn').hide();
    $('#back-to-surveys').hide();
    $('#back-to-analytics').hide();
    $('#title').hide();
    $('.lead').hide();
    $('#splash-container').hide();
    $('#my-surveys-headline').show();
    $('#analytics-headline').hide();
    $('#new-survey-headline').hide();
    $('#signup-container').hide();
    $('#login-container').hide();
    $('#dashboard-container').hide();
    $('body').css("background-image", "url(img/backgroundyellow.jpg)");
    // Compiling display template for surveys
    var template = Handlebars.compile($('#display-user-template').html());
    for (var i=0; i < data.length; i++) {
      data[i].formattedDate = new Date(data[i].date).toDateString();
      $('#display-container').append(template(data[i]));
      // Adding event listener to view survey button
      var link = $('.view-survey').last();
      link.click(function() {
        // Grabbing id from parent element
        var id = $(this).parent().attr('data-id');
        getUserViewSurvey(id);
      });
      var edit_link = $('.edit-survey');
      // Add eventlistener to edit survey
      edit_link.click(function() {
        var id = $(this).parent().attr('data-id');
        getUserEditSurvey(id);
      });
    };
  };

  // 7. View user's survey
  // 7a. getUserViewSurvey
  var getUserViewSurvey = function(id) {
    $.get('/surveys/'+ id).done(function(data) {
      data.formattedDate = new Date(data.date).toDateString();
      renderUserViewSurvey(data);
    });
  };

  // 7b. renderUserViewSurvey
  var renderUserViewSurvey = function(data) {
    $('#display-container').empty();
    $('#view-survey-btn').hide();
    $('#new-survey-btn').hide();
    $('#view-dashboard-btn').show();
    $('#view-analytics-btn').hide();
    $('#back-to-surveys').show();
    $('#title').hide();
    $('.lead').hide();
    $('#splash-container').hide();
    $('#my-surveys-headline').show();
    $('#analytics-headline').hide();
    $('#new-survey-headline').hide();
    $('#signup-container').hide();
    $('#login-container').hide();
    $('#dashboard-container').hide();
    // Compiling template for specific survey
    var template = Handlebars.compile($('#view-user-survey-template').html());
    $('#display-container').append(template(data));
    var link = $('.edit-survey');
    // Add eventlistener to edit survey
    link.click(function() {
      var id = $(this).parent().attr('data-id');
      getUserEditSurvey(id);
    });
  };

  // 8. userEditSurvey
  // 8a. getUserEditSurvey
  var getUserEditSurvey = function(id) {
    $.get('/surveys/'+ id).done(function(data) {
      data.formattedDate = new Date (data.date).toDateString();
      renderUserEditSurvey(data);
    });
  };

  // 8b. renderUserEditSurvey
  var renderUserEditSurvey = function(data) {
    $('#display-container').empty();
    $('#view-survey-btn').hide();
    $('#new-survey-btn').hide();
    $('#view-dashboard-btn').show();
    $('#view-analytics-btn').hide();
    $('#back-to-surveys').show();
    $('#title').hide();
    $('.lead').hide();
    $('#splash-container').hide();
    $('#my-surveys-headline').show();
    $('#analytics-headline').hide();
    $('#new-survey-headline').hide();
    $('#signup-container').hide();
    $('#login-container').hide();
    $('#dashboard-container').hide();
    // Handlebars compiling template for editing survey
    var template = Handlebars.compile($('#survey-edit-template').html());
    $('#display-container').append(template(data));
    // Event listener to subment edit
    $('.edit-survey-submit').click(function() { 
      updateSurveyResponse();
    });
  };

  // 8c. updateSurveyResponse
  var updateSurveyResponse = function() {
    var date = $("input[name='date']").val();
    var id = $("input[name='_id']").val();
    var teaching_quality = $("input[name='teaching_quality']").val();
    var comfort_level = $("input[name='comfort_level']").val();
    var lesson_score = $("input[name='lesson_score']").val();
    var comments = $("textarea[name='comments']").val();
    var feeling = $("input[name='feeling']").val();
    var happy_hr_suggestion = $("input[name='happy_hr_suggestion']").val();
    // Setting data object for ajax
    var surveyUpdateData = {
      date: date,
      teaching_quality: teaching_quality,
      comfort_level: comfort_level,
      lesson_score: lesson_score,
      comments: comments,
      feeling: feeling,
      happy_hr_suggestion: happy_hr_suggestion,
    };
    // Sending put request with object data
    $.ajax({
      url: "http://localhost:3000/surveys/"+id,
      method: "PUT",
      data: surveyUpdateData
    }).done(getUserSurveys);
  };

  // 9. View user's profile
  // 9a. getUserProfile 
  var getUserProfile = function(id) {
    $.get('/users/:id').done(function(data) {
      renderUserProfile(data);
    });
  };

  // 9b. renderUserProfile
  var renderUserProfile = function(data) {
    $('#display-container').empty();
    $('#user-profile-btn').hide();
    $('#view-survey-btn').hide();
    $('#new-survey-btn').hide();
    $('#view-dashboard-btn').show();
    $('#view-analytics-btn').hide();
    $('#back-to-analytics').hide();
    $('#back-to-surveys').hide();
    $('#title').hide();
    $('.lead').hide();
    $('#splash-container').hide();
    $('#my-surveys-headline').hide();
    $('#analytics-headline').hide();
    $('#new-survey-headline').hide();
    $('#signup-container').hide();
    $('#login-container').hide();
    $('#dashboard-container').hide();
    $('body').css("background-image", "url(img/backgroundyellow.jpg)");
    var template = Handlebars.compile($("#user-profile-template").html());
    $('#display-container').append(template(data));
  };

  // 10. Edit user's profile
  // 10a. editUserProfile
  var editUserProfile = function() {
    $('#display-container').empty();
    var userId = Cookies.get('loggedInId');
    $.get('/users/:id').done(function(data) {
      var template = Handlebars.compile($('#edit-user-profile-template').html());
      $('#display-container').append(template(data));
    });
  };

  // 10b. updateUserProfile
  var updateUserProfile = function() {
    var userId = Cookies.get('loggedInId');
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

  // 11. Delete user's profile & account
  // 11a. confirmDelete
  var confirmDelete = function() {
    if (confirm("Do you really want to say goodbye?")) {
        deleteUserProfile();
    } else {
        false;
    }       
  };

  // 11b. deleteUserProfile
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
  // 0. 
  // Homepage button > renderHomepage
  $('body').on('click', '#home-btn', renderHomepage);
  // Back to analytics button > getSurveyDates
  $('body').on('click', '#back-to-analytics', getSurveyDates);
  // Back to surveys button > getUserSurveys
  $('body').on('click', '#back-to-surveys', getUserSurveys);

  // 1. 
  // Login button > renderLoginForm
  $('.login-btn').on('click', renderLoginForm);
  // Login submit button > submitLoginForm
  $('body').on('click', '#login-submit-btn', submitLoginForm);

  // 2. 
  // Signup button > renderSignupForm
  $('.signup-btn').on('click', renderSignupForm);
  // Signup submit button > submitSignupForm
  $('body').on('click', '#signup-submit-btn', submitSignupForm);
  
  // 3. 
  // Logout button > logoutUser
  $('body').on('click', '#logout-btn', logoutUser);
  
  // 4.
  // Back to dashboard button > viewDashboard
  $('body').on('click', '#view-dashboard-btn', viewDashboard);
  // New Survey button > renderSurveys
  $('body').on('click', '#new-survey-btn', renderSurveyForm);
  // Submit new survey > submitNewSurvey
  $('body').on('click', '#survey-submit-btn', createSurveyResponse);
  // Analytics button > getSurveys
  $('body').on('click', '#view-analytics-btn', getSurveyDates);
  
  // 6. 
  // View my surveys > getUserSurveys
  $('body').on('click', '#view-survey-btn', getUserSurveys);
  // Submit survey update > getUserSurveys
  $('body').on('click', '#survey-submit-edit-btn', updateSurveyResponse);
  
  // 7. 
  // View individual survey event listener > getUserViewSurvey
  // In code, to grab element ID
  // Back to view survey > getUserViewSurvey

  // 8.
  // Edit individual survey > getUserEditSurvey
  // In code, to grab element ID

  // 9. 
  // View user profile > getUserProfile
  $('body').on('click', '#user-profile-btn', getUserProfile);
  
  // 10
  // Edit user profile > editUserProfile
  $('body').on('click', '#edit-user-profile-btn', editUserProfile);
  // Update user profile > updateUserProfile
  $('body').on('click', '#edit-user-submit-btn', updateUserProfile);

  // 11. 
  // Delete user profile > deleteUserProfile
  $('body').on('click', '#delete-user-profile-btn', confirmDelete);

  // If user is logged in, go directly to dashboard
  if (document.cookie) {
    viewDashboard();
  };

});