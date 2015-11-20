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
    $('#display-container').empty();
    $('#logout-btn').show();
    $('#login-btn').hide();
    $('#signup-btn').hide();
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

  // If user is logged in, go directly to dashboard
  if (document.cookie) {
    viewDashboard();
  };


});