
var saveButton = document.querySelector('.js-save-button');
var ideaInputs = document.querySelectorAll(".js-idea-inputs");
var cardSection = document.querySelector('.js-card-section');

var ideaArray = [];

window.addEventListener('load', createCardsOnReload);

saveButton.addEventListener('click', createNewIdea);
cardSection.addEventListener('click', function(event){
  if (event.target.classList.contains('js-delete-button')) {
    deleteCard(event);
  }
});

ideaInputs[0].addEventListener('input', enableSaveButton);
// Add error message if no body?

function createNewIdea() {
  var idea = new Idea(ideaInputs[0].value, ideaInputs[1].value);
  ideaArray.push(idea);
  // console.log(ideaArray);
  idea.saveToStorage();
  createCard(idea);
  clearInputs();
};

function clearInputs() {
  for (var i = 0; i < ideaInputs.length; i++) {
    ideaInputs[i].value = '';
  };
  disableSaveButton();
}

function createCardsOnReload(){
  for(var key in localStorage) {
    if(localStorage.hasOwnProperty(key)) {
      var card = localStorage.getItem(key);
      var parsedCard = JSON.parse(card);

      var idea = new Idea(parsedCard.title, parsedCard.body, parsedCard.quality, parsedCard.id);
      ideaArray.push(idea);

      createCard(parsedCard);
    }
  }
}

function createCard(idea) {
  var cardHTML = `<div class="idea-box js-idea-card" data-id=${idea.id}>
    <h2 class="js-text js-title-text" contenteditable="false">${idea.title}</h2>
    <p class="js-text js-body-text" contenteditable="false">${idea.body}</p>
    <div class="idea-box-bottom">
      <img class="arrows js-down-vote" src="icons/downvote.svg">
      <img class="arrows js-up-vote" src="icons/upvote.svg">
      <p class="quality">Quality: <span>${idea.quality}</span></p>
      <img class="delete js-delete-button" src="icons/delete.svg">
    </div>
  </div>`;
  cardSection.insertAdjacentHTML('afterbegin', cardHTML);
}

function findIndexNumber(objId) {
  for (var i = 0; i < ideaArray.length; i++) {
    if (ideaArray[i].id === objId) {
      return i
    }
  }
}

function deleteCard(event) {
  var cardId = event.target.parentElement.parentElement.dataset.id;
  
  var index = findIndexNumber(cardId);
  ideaArray[index].deleteFromStorage();
  ideaArray.splice(index, 1);

  event.target.closest('.js-idea-card').remove();
}

function disableSaveButton() {
  saveButton.disabled = true;
}

function enableSaveButton() {
  saveButton.disabled = false;
}

// Upvote/Downvote Functionality




/* card edit function */
function editText(event) {
    event.target.contentEditable = true;
}

cardSection.addEventListener("dblclick", function (event) {
  if (event.target.classList.contains("js-text")) {
    // Use this a lot - refactor into function
    var cardId = event.target.parentElement.dataset.id;

    editText(event);
    document.body.addEventListener("keypress", enterSaveText);
    // Click - how to target element to save to local storage?
    document.body.addEventListener("click", clickSaveText);
  }
});

// Check if we can just use clickSaveText function
function saveText(event) {
  event.target.contentEditable = false;
}

function saveOnClick() {
  var editableFields = document.querySelectorAll(".js-text");
  for (i=0; i < editableFields.length; i++) {
    editableFields[i].contentEditable = false;
  }
}

function enterSaveText(event) {
  if (event.code === 'Enter') {

    updateIdea(event);    
    saveText(event); 
    document.body.removeEventListener("keypress", enterSaveText);
    document.body.removeEventListener("click", clickSaveText);
    // return false;
  }                        
}; 

function clickSaveText() {
  if (!event.target.classList.contains("js-text")) {
    // saveText(event);

    // updateIdea(cardId);
    saveOnClick();
  }
}

function updateIdea(event) {
  var cardId = event.target.parentElement.dataset.id;
  var index = findIndexNumber(cardId);

  if (event.target.classList.contains("js-title-text")) {
    var newTitle = event.target.innerText;
    ideaArray[index].updateSelf(newTitle, 'title');
  } else if (event.target.classList.contains("js-body-text")) {
    var newBody = event.target.innerText; 
    ideaArray[index].updateSelf(newBody, 'body');
  };

  ideaArray[index].saveToStorage();
}


cardSection.addEventListener('click', function(){
  var votebutton;
  if (event.target.classList.contains('js-up-vote')) {
    votebutton = 'up';
    vote(event, votebutton);
  } else if (event.target.classList.contains('js-down-vote')) {
    votebutton = 'down'
    vote(event, votebutton);
  }
})

function vote(event, votebutton) {
  var cardId = event.target.parentElement.parentElement.dataset.id;
  var index = findIndexNumber(cardId);
  if (votebutton === 'up') {
    ideaArray[index].updateQuality('up');
    event.target.nextElementSibling.firstElementChild.innerText = ideaArray[index].quality;
  } else if (votebutton === 'down') {
    ideaArray[index].updateQuality('down');
    event.target.nextElementSibling.nextElementSibling.firstElementChild.innerText = ideaArray[index].quality;
  };
  ideaArray[index].saveToStorage();
  ideaArray.splice(index, 1, ideaArray[index]);
}

