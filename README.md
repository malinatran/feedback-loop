## Working name: Feedback Loop
Team Tyrion

**Group Members:**
* Malina Tran
* Mike Wiesenhart
* Peter Winterhof

**Technologies:**
* Node
* Express
* Mongo
* AJAX

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

**Source Code Roadmap:**
In app.js:
0. Go to homepage 
- renderHomepage

1. Login user 
- 1a. renderLoginForm
- 1b. submitLoginForm

2. Create a new user
- 2a. renderSignupForm (hide buttons, compile Handlebars template)
- 2b. submitSignupForm (create user obj, send POST req)
- 2c. createUser (set cookies to the user's ID)

3. Logout user (logging out on the client side)
- logoutUser

4. Display user's dashboard

5. Fill out survey
- 5a. renderSurveyForm (hide buttons, compile Handlebars template)
- 5b. createSurveyResponse (create data obj, send POST req)

6. View user's surveys
- 6a. getUserSurveys
- 6b. renderUserSurveys (renders user's own surveys, attaches view & edit listeners)

7. View user's survey
- 7a. getUserViewSurvey (gets specific survey)
- 7b. renderUserViewSurvey (compile template, add event listener)

8. Edit user's survey
- 8a. getUserEditSurvey (gets survey data to display and editing)
- 8b. renderUserEditSurvey
- 8c. updateSurveyResponse (grab form values, create data obj, send POST req)

9. View user's profile
- 9a. getUserProfile
- 9b. renderUserProfile

10. Edit user's profile
- 10a. editUserProfile
- 10b. updateUserProfile

11. Delete user's profile & account
- deleteUserProfile

Click functions (corresponds with above functions):
0. 
Homepage button > renderHomepage

1. 
Login button > renderLoginForm
Login submit button > submitLoginForm

2. 
Signup button > renderSignupForm
Signup submit button > submitSignupForm

3. 
Logout button > logoutUser

4. 
Back to dashboard button > viewDashboard
New survey button > renderSurveys
Submit new survey button > submitNewSurvey

6. 
View my surveys > getUserSurveys
Submit survey update > getUserSurveys

7. 
View individual survey event listener > getUserViewSurvey
In code, to grab element ID
Back to view survey > getUserViewSurvey

8.
Edit individual survey > getUserEditSurvey
In code, to grab element ID

9. 
View user profile button > getUserProfile

10. 
Edit user profile button > editUserProfile
Update user profile button > updateUserProfile

11. 
Delete user profile button > deleteUserProfile

