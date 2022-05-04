"use strict";

// global to hold the User instance of the currently-logged-in user
let currentUser;

/******************************************************************************
 * User login/signup/login
 */

/** Handle login form submission. If login ok, sets up the user instance */

async function login(evt) {
  console.debug("login");
  evt.preventDefault();

  // grab the username and password
  const username = $("#login-username").val();
  const password = $("#login-password").val();

  // User.login retrieves user info from API and returns User instance
  // which we'll make the globally-available, logged-in user.
  currentUser = await User.login(username, password);

  $loginForm.trigger("reset");

  saveUserCredentialsInLocalStorage();
  updateUIOnUserLogin();
}

$loginForm.on("submit", login);

/** Handle signup form submission. */

async function signup(evt) {
  console.debug("signup");
  evt.preventDefault();

  const name = $("#signup-name").val();
  const username = $("#signup-username").val();
  const password = $("#signup-password").val();

  // User.signup retrieves user info from API and returns User instance
  // which we'll make the globally-available, logged-in user.
  currentUser = await User.signup(username, password, name);

  saveUserCredentialsInLocalStorage();
  updateUIOnUserLogin();

  $signupForm.trigger("reset");
}

$signupForm.on("submit", signup);

/** Handle click of logout button
 *
 * Remove their credentials from localStorage and refresh page
 */

function logout(evt) {
  console.debug("logout", evt);
  localStorage.clear();
  location.reload();
}

$navLogOut.on("click", logout);

/******************************************************************************
 * Storing/recalling previously-logged-in-user with localStorage
 */

/** If there are user credentials in local storage, use those to log in
 * that user. This is meant to be called on page load, just once.
 */

async function checkForRememberedUser() {
  console.debug("checkForRememberedUser");
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  if (!token || !username) return false;
  
  // try to log in with these credentials (will be null if login failed)
  currentUser = await User.loginViaStoredCredentials(token, username);
}

/** Sync current user information to localStorage.
 *
 * We store the username/token in localStorage so when the page is refreshed
 * (or the user revisits the site later), they will still be logged in.
 */

function saveUserCredentialsInLocalStorage() {
  console.debug("saveUserCredentialsInLocalStorage");
  if (currentUser) {
    localStorage.setItem("token", currentUser.loginToken);
    localStorage.setItem("username", currentUser.username);
  }
}

/******************************************************************************
 * General UI stuff about users
 */

/** When a user signs up or registers, we want to set up the UI for them:
 *
 * - show the stories list
 * - update nav bar options for logged-in user
 * - generate the user profile part of the page
 */

function updateUIOnUserLogin() {
  console.debug("updateUIOnUserLogin");

  $allStoriesList.show();

  updateNavOnLogin();
}

//when a logged in user checks or unchecks the story as a favorite
//this event handler is called
async function clickFavorite(event) {
  console.debug('clickfavorite')
  if (currentUser) {
    const parentLI = event.target.closest('li');
    const storyId = parentLI.id;

    //if the user just checked the story, addFavorite() on the user instance is called and the favorite list is updated
    if (event.target.checked) {
      currentUser.favorites = await currentUser.addFavorite(currentUser, storyId);
    }
    //if the user just unchecked the story, removeFavorite() on the user instance is called and the favorite list is updated
    else if (event.target.checked === false) {
      currentUser.favorites = await currentUser.removeFavorite(currentUser, storyId);
    }
    
  }
  else return;

}
$allStoriesList.on('click', '.checkbox', clickFavorite);

//when a logged in user deletes their own story from the 'my stories' page this 
//event handler is called
async function deleteStory(event) {
  console.debug("deleteStory");
  if (currentUser) {
    const parentLI = event.target.closest('li');
    const storyId = parentLI.id;

    //the deleteUserStory method on the User class is called
    const deletedStory = await currentUser.deleteUserStory(currentUser, storyId);

    //the users own stories list is pulled from the api
    
    const storyIndex = currentUser.ownStories.indexOf(deletedStory);
    currentUser.ownStories.splice(storyIndex, 1);

  }

}
