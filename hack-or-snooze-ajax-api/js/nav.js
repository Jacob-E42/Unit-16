"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories");
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick");
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  $(".main-nav-links").show();
  hidePageComponents();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
  putStoriesOnPage();
}

//show ssubmit new story form when user clicks on 'submit'
function navSubmitClick(){
  console.debug("navSubmitClick");
  hidePageComponents();
  $storyForm.show();
}
$navSubmitStory.on("click", navSubmitClick);

//show the user's favorite stories when the user clicks on 'favorites' in the nav bar
function navFavorites(){
  console.debug('navFavorites')
  hidePageComponents();
  putFavoriteStoriesOnPage();
}
$navFavorites.on('click', navFavorites);

//show the user's own submitted stories when the user clicks on 'my stories'
function navMyStories(){
  console.debug('navMyStories');
  hidePageComponents();
  putMyStoriesOnPage();
}
$navMyStories.on("click", navMyStories);


