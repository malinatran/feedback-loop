## Feedback Loop

Team Tyrion

**Group Members:**
  * Malina Tran
  * Mike Wiesenhart
  * Peter Winterhof

**Technologies (Languages, Frameworks, and Libraries):**
  * JavaScript
  * jQuery
  * Node.js
  * Express.js
  * Mongo & Mongoose
  * AJAX
  * Moment.js
  * Emoji-Picker.js
  * Bootstrap
  * Yelp API

**App Idea:**
Web app that manages daily 'exit tickets' – survey forms for students to give feedback to instructors – and aggregates overall feedback for student viewing. The app will create a better feedback loop for students and instructors, one that is more transparent, social, and dynamic.

**Minimally Viable Product (MVP):**
  * There are two models: Users and Survey Responses (has many relationship). 
    * Users include username and password.
    * Survey Responses include a 1-10 ranking for: Teaching Quality, Lesson Score, and Comfort Level; other text fields include Comments, Feelings, and Happy Hour Suggestions. (Survey Responses will be tied to each User).
  * User will be able to sign up, login, logout, edit their account info and delete their own account.
  * User's dashboard, upon login, will be able to: 
    * Complete a survey for the day
    * View and edit past surveys submitted
    * View analytics and aggregate survey responses submitted by others (this will be anonymous). For instance, there is a Feed feature on the Analytics page to view other students' comments, emojis, and suggestions for this evening's happy hour location.

**Bonus Features:**
  * Incorporating a Yelp API to help with suggestions for Happy Hour. 
  * Incorporating emojis or Giphy API for users to express their feelings.
  * Create an upvote/counting feature.
  * Display data through Google Chart API.
  * Addition of avatar or gravatr for user's profile.

**Wireframes:**
https://drive.google.com/a/nooklyn.com/folderview?id=0B9qXBzKsKS2NcnlBVkNqV1hGUnM&usp=sharing

**Post-Project Retro**
* What aspects of your approach and attitude during this project would you like to improve upon?
(MT) Our group was fairly ambitious when we first started the project, and we were able to achieve so much which I'm really proud of. We were at first ambivalent about our project idea, but I think we were able to push through and make it interesting and engaging and keep the momentum. If we could do this again, I think we could have been more collaborative and remotely pair programmed. Regardless, I think we did a great job!  
(PW)
(MW)

* What aspects of your coding process during this project would you like to improve upon?
(MT) We could have done remote pair programming. We did a lot more modular coding (is that a thing?) where we would delegate tasks/features and then update the master. 
(PW)
(MW)

* What lines of code are you most proud of and why?
(MT) The code block that retrieves data from the Yelp API (server.js, line 298). This was my first time using a third-party API, so that was pretty cool.
```
app.get('/businesses/:find/:near', function(req, res) {
  yelp.search({ term: req.params.find, location: req.params.near })
    .then(function (data) {
      res.send(data.businesses);
    })
    .catch(function (err) {
      console.error(err);
    });
});
```
(PW)
(MW)

* What lines of code do you understand the least and why?
(MT) I understand most of the code, but what I am less familiar with is the function to check the date and determine whether the user must fill out survey or not (app.js, line 584). I only used the date object for one method, but it seems like there are other ways to manipulate data through the object... getDate? setDate? 
(PW)
(MW)

**Source Code Roadmap:**
In app.js:

Go to homepage 
  * renderHomepage

1. Login user 
  * 1a. renderLoginForm
  * 1b. submitLoginForm

2. Create a new user
  * 2a. renderSignupForm (hide buttons, compile Handlebars template)
  * 2b. submitSignupForm (create user obj, send POST req)
  * 2c. createUser (set cookies to the user's ID)

3. Logout user (logging out on the client side)
  * logoutUser

4. Display user's dashboard, surveys, and analytics
  * 4. viewDashboard
  * 4a. getSurveyDates
  * 4b. renderSurveyAnalytics
  * 4c. getAnalytics
  * 4d. renderDateAnalytics

5. Fill out survey
  * 5a. renderSurveyForm (hide buttons, compile Handlebars template)
  * 5b. createSurveyResponse (create data obj, send POST req)

6. View user's surveys
  * 6a. getUserSurveys
  * 6b. renderUserSurveys (renders user's own surveys, attaches view & edit listeners)

7. View user's survey
  * 7a. getUserViewSurvey (gets specific survey)
  * 7b. renderUserViewSurvey (compile template, add event listener)

8. Edit user's survey
  * 8a. getUserEditSurvey (gets survey data to display and editing)
  * 8b. renderUserEditSurvey
  * 8c. updateSurveyResponse (grab form values, create data obj, send POST req)

9. View user's profile
  * 9a. getUserProfile
  * 9b. renderUserProfile

10. Edit user's profile
  * 10a. editUserProfile
  * 10b. updateUserProfile

11. Delete user's profile & account
  * 11a. confirmDelete
  * 11b. deleteUserProfile
 
12. Like or dislike proposed happy hour location
  * 12a. likeSuggestion
  * 12b. dislikeSuggestion

13. View businesses
  * 13a. searchYelp
  * 13b. renderBusinesses
  * 13c. selectBusiness

14. Check date to see if survey needs to be completed
  * checkDate

**Click functions (corresponds with above functions):**

Homepage button > renderHomepage
Back to analytics button > getSurveyDates
Back to surveys button > getUserSurveys

1. 
  * Login button > renderLoginForm
  * Login submit button > submitLoginForm

2. 
  * Signup button > renderSignupForm 
  * Signup submit button > submitSignupForm

3. 
  * Logout button > logoutUser

4. 
  * Back to dashboard button > viewDashboard 
  * New survey button > renderSurveys
  * Submit new survey button > submitNewSurvey

5. 
  * No click functions

6. 
  * View my surveys > getUserSurveys
  * Submit survey update > getUserSurveys

7. 
  * View individual survey event listener > getUserViewSurvey (in code block)
  * Back to view survey > getUserViewSurvey

8. 
  * Edit individual survey > getUserEditSurvey (in code block)

9. 
  * View user profile button > getUserProfile

10. 
  * Edit user profile button > editUserProfile
  * Update user profile button > updateUserProfile

11. 
  * Delete user profile button > confirmDelete

12. 
  * Thumbs up button > likeSuggestion
  * Thumbs down button > dislikeSuggestion

13. 
  * Search icon > searchYelp
  * Select business button > selectBusiness
