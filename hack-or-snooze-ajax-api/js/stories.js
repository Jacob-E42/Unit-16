"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();

  //variable to be used as check property for checkbos, if the user already favorited it
  let storyChecked = '';
  
  //if user is logged in, for every favorite story the storyChecked is assigned so that the checkbox will display as checked
  if (currentUser) {
    for (let fav of currentUser.favorites) {
      if(fav.storyId === story.storyId){
        storyChecked = "checked";
      } 
    }
  }

  
  return $(`
      <li id="${story.storyId}">
        <span class="checkbox hidden">
          <input type="checkbox" ${storyChecked}>
        </span>
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  
  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }
   
  //only show checkboxes if the user is signed in
  if(currentUser){
    $('.checkbox').show();
  
  }
  $allStoriesList.show();
}

//copy of putStoriesOnPage() that only displays the favorited stories
//when the user clicks "favorites" in the nav bar
function putFavoriteStoriesOnPage(){
  console.debug("putFavoriteStoriesOnPage");
  $allStoriesList.empty();

  for (let favStory of currentUser.favorites){
    const $story = generateStoryMarkup(favStory);
    $allStoriesList.append($story);
  }
  if(currentUser){
    $('.checkbox').show();
  }
  $allStoriesList.show();
}

//copy of putStoriesOnPage() that only displays the user submitted stories
//when the user clicks "my stories" in the nav bar
function putMyStoriesOnPage(){
  console.debug("putMyStoriesOnPage");
  $allStoriesList.empty();
  
  for (let story of currentUser.ownStories){
    const $story = generateStoryMarkup(story);

    //a delete button is added to the markup to give the user to delete a story
    const $deleteButton = $(`<button class="delete-button">Delete</button>`);
    $allStoriesList.append($story);
    $story.append($deleteButton);
  }
  if(currentUser){
    $('.checkbox').show();
  }
  $allStoriesList.show();
}

//event handler when the submit button is clicked in the new story form
//it creates a new story obj literal from the form inputs, calls addStory() on the storyList instance,
// and updates the user's list of stories
async function submitNewStory(evt) {
  evt.preventDefault();

  const storyObj = { title: $formTitle.val(), author: $formAuthor.val(), url: $formUrl.val() };
  if (currentUser) {
    const newStory = await storyList.addStory(currentUser, storyObj);
    $storyForm.hide();
    putStoriesOnPage();
    currentUser.ownStories.push(newStory);
    $storyForm.trigger("reset");
  }
  else return;
}

$storyForm.on('submit', submitNewStory);

//This handler runs when a delete button is clicked on one of the user's own stories.
//it calls deleteStory() from user.js, updates the story list and redisplays the user's stories.
async function clickDeleteButton(event){
  await deleteStory(event);
  storyList = await StoryList.getStories();
  putMyStoriesOnPage();
}
$allStoriesList.on("click", '.delete-button', clickDeleteButton);