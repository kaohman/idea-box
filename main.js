
var saveButton = document.querySelector('.js-save-button');
var ideaInputs = document.querySelectorAll(".js-idea-inputs");
var cardSection = document.querySelector('.js-card-section');

var ideaArray = [];

var currentEvent;

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
      <img class="arrows" src="icons/downvote.svg">
      <img class="arrows" src="icons/upvote.svg">
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
cardSection.addEventListener("dblclick", updateCard);

function updateCard(event) {
  if (event.target.classList.contains("js-text")) {
    currentEvent = event.target;
    editText();

    document.body.addEventListener("keypress", function(event) {
      console.log("enter: " + event.target);
      if (event.code === 'Enter') {
        saveText();
      }
    })

    document.body.addEventListener("click", function(event) {
      console.log("click: " + event.target);
      if (!event.target.classList.contains("js-text")) {
        saveText();
      }
    })
  }
}

function editText() {
    currentEvent.contentEditable = true;
}

function saveText(event) {
  updateIdea();    
  setUneditable(); 
  document.body.removeEventListener("keypress", saveText);
  document.body.removeEventListener("click", saveText);
}; 

function setUneditable() {
  currentEvent.contentEditable = false;
}

function updateIdea() {
  var cardId = currentEvent.parentElement.dataset.id;
  var index = findIndexNumber(cardId);

  if (currentEvent.classList.contains("js-title-text")) {
    var newTitle = currentEvent.innerText;
    ideaArray[index].updateSelf(newTitle, 'title');
  } else if (currentEvent.classList.contains("js-body-text")) {
    var newBody = currentEvent.innerText; 
    ideaArray[index].updateSelf(newBody, 'body');
  };

  ideaArray[index].saveToStorage();
}

// function saveOnClick() {
//   var editableFields = document.querySelectorAll(".js-text");
//   for (i=0; i < editableFields.length; i++) {
//     editableFields[i].contentEditable = false;
//   }
// }

// function updateIdeaOnEnter(event) {
//   var cardId = event.target.parentElement.dataset.id;
//   var index = findIndexNumber(cardId);

//   if (event.target.classList.contains("js-title-text")) {
//     var newTitle = event.target.innerText;
//     ideaArray[index].updateSelf(newTitle, 'title');
//   } else if (event.target.classList.contains("js-body-text")) {
//     var newBody = event.target.innerText; 
//     ideaArray[index].updateSelf(newBody, 'body');
//   };

//   ideaArray[index].saveToStorage();
// }

// function clickSaveText(event) {
//   console.log(event.target);
//   if (!event.target.classList.contains("js-text")) {
//     console.log(currentEvent);
//     debugger
//     // saveText(event);
//     updateIdeaOnClick(currentEvent);
//     saveOnClick();
//   }
// }

